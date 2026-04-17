from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session, joinedload
from uuid import UUID
import math

from app.core.dependencies import get_db, get_current_user
from app.models.user import User
from app.models.review import Review, ReviewInsight
from app.schemas.review import ReviewCreate, ReviewUpdate, ReviewOut, ReviewListOut
from app.services.ai_service import analyze_review

router = APIRouter()


# helpers

PAGE_SIZE = 10

def _review_query(db: Session):
    """Always eager-load author + insights so ReviewOut never lazy-loads."""
    return (
        db.query(Review)
        .options(
            joinedload(Review.author),
            joinedload(Review.insights),
        )
    )


# submit a review

@router.post("", response_model=ReviewOut, status_code=201)
async def create_review(
    payload: ReviewCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # one review per user per movie
    existing = (
        db.query(Review)
        .filter(
            Review.user_id == current_user.id,
            Review.tmdb_movie_id == payload.tmdb_movie_id,
        )
        .first()
    )
    if existing:
        raise HTTPException(
            status_code=400,
            detail="You have already reviewed this movie. Edit your existing review instead.",
        )

    review = Review(
        user_id       = current_user.id,
        tmdb_movie_id = payload.tmdb_movie_id,
        movie_title   = payload.movie_title,
        rating        = payload.rating,
        content       = payload.content,
    )
    db.add(review)
    db.commit()
    db.refresh(review)

    # AI insights (best-effort, never blocks the response)
    insight_data = await analyze_review(payload.movie_title, payload.content)
    if insight_data:
        insight = ReviewInsight(review_id=review.id, **insight_data)
        db.add(insight)
        db.commit()

    # reload with relationships
    return _review_query(db).filter(Review.id == review.id).first()


# get all reviews for one movie

@router.get("/movie/{tmdb_movie_id}", response_model=ReviewListOut)
def get_reviews_for_movie(
    tmdb_movie_id: str,
    page:          int     = Query(1, ge=1),
    db:            Session = Depends(get_db),
):
    base = _review_query(db).filter(Review.tmdb_movie_id == tmdb_movie_id)
    total   = base.count()
    results = (
        base
        .order_by(Review.created_at.desc())
        .offset((page - 1) * PAGE_SIZE)
        .limit(PAGE_SIZE)
        .all()
    )
    return ReviewListOut(
        results     = results,
        total       = total,
        page        = page,
        total_pages = math.ceil(total / PAGE_SIZE) or 1,
    )


# get all reviews by a user 

@router.get("/user/{username}", response_model=ReviewListOut)
def get_reviews_by_user(
    username: str,
    page:     int     = Query(1, ge=1),
    db:       Session = Depends(get_db),
):
    user = db.query(User).filter(User.username == username).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    base    = _review_query(db).filter(Review.user_id == user.id)
    total   = base.count()
    results = (
        base
        .order_by(Review.created_at.desc())
        .offset((page - 1) * PAGE_SIZE)
        .limit(PAGE_SIZE)
        .all()
    )
    return ReviewListOut(
        results     = results,
        total       = total,
        page        = page,
        total_pages = math.ceil(total / PAGE_SIZE) or 1,
    )


# get a single review by its id

@router.get("/{review_id}", response_model=ReviewOut)
def get_review(review_id: UUID, db: Session = Depends(get_db)):
    review = _review_query(db).filter(Review.id == review_id).first()
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
    return review


# edit your own review

@router.patch("/{review_id}", response_model=ReviewOut)
async def update_review(
    review_id:    UUID,
    payload:      ReviewUpdate,
    db:           Session = Depends(get_db),
    current_user: User    = Depends(get_current_user),
):
    review = db.query(Review).filter(Review.id == review_id).first()
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
    if review.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="You can only edit your own reviews")

    if payload.rating  is not None:
        review.rating  = payload.rating
    if payload.content is not None:
        review.content = payload.content

    db.commit()
    db.refresh(review)

    # re-run AI insights if content changed
    if payload.content is not None:
        insight_data = await analyze_review(review.movie_title, review.content)
        if insight_data:
            existing_insight = (
                db.query(ReviewInsight)
                .filter(ReviewInsight.review_id == review.id)
                .first()
            )
            if existing_insight:
                existing_insight.sentiment = insight_data["sentiment"]
                existing_insight.themes    = insight_data["themes"]
                existing_insight.verdict   = insight_data["verdict"]
            else:
                db.add(ReviewInsight(review_id=review.id, **insight_data))
            db.commit()

    return _review_query(db).filter(Review.id == review.id).first()


# delete your own review 

@router.delete("/{review_id}", status_code=204)
def delete_review(
    review_id:    UUID,
    db:           Session = Depends(get_db),
    current_user: User    = Depends(get_current_user),
):
    review = db.query(Review).filter(Review.id == review_id).first()
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
    if review.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="You can only delete your own reviews")

    # cascade deletes the insight too (configured below)
    db.delete(review)
    db.commit()