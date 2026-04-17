from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session, joinedload
from uuid import UUID
import math

from app.core.dependencies  import get_db, get_current_user
from app.models.user        import User
from app.models.review      import Review
from app.models.watchlist   import WatchlistItem
from app.schemas.user       import UserPublic, UserUpdate, UserProfileOut
from app.schemas.review     import ReviewOut, ReviewListOut
from app.schemas.watchlist  import WatchlistAdd, WatchlistItemOut, WatchlistOut

router = APIRouter()

PAGE_SIZE = 10


# helpers 

def _get_user_or_404(username: str, db: Session) -> User:
    user = db.query(User).filter(User.username == username).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


def _build_profile(user: User, db: Session) -> UserProfileOut:
    review_count = db.query(Review).filter(Review.user_id == user.id).count()
    return UserProfileOut(
        id           = user.id,
        username     = user.username,
        bio          = user.bio,
        avatar_url   = user.avatar_url,
        created_at   = user.created_at,
        review_count = review_count,
    )


# public profile 

@router.get("/{username}", response_model=UserProfileOut)
def get_profile(username: str, db: Session = Depends(get_db)):
    user = _get_user_or_404(username, db)
    return _build_profile(user, db)


# edit your own profile 

@router.patch("/me/profile", response_model=UserPublic)
def update_profile(
    payload:      UserUpdate,
    db:           Session = Depends(get_db),
    current_user: User    = Depends(get_current_user),
):
    if payload.bio is not None:
        current_user.bio = payload.bio
    if payload.avatar_url is not None:
        current_user.avatar_url = payload.avatar_url

    db.commit()
    db.refresh(current_user)
    return current_user


#  reviews by a user (also available at /reviews/user/{username}
#  but duplicated here so the users namespace is self-contained) 

@router.get("/{username}/reviews", response_model=ReviewListOut)
def get_user_reviews(
    username: str,
    page:     int     = Query(1, ge=1),
    db:       Session = Depends(get_db),
):
    user = _get_user_or_404(username, db)

    base = (
        db.query(Review)
        .options(
            joinedload(Review.author),
            joinedload(Review.insights),
        )
        .filter(Review.user_id == user.id)
    )
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


# watchlist 

@router.get("/me/watchlist", response_model=WatchlistOut)
def get_my_watchlist(
    db:           Session = Depends(get_db),
    current_user: User    = Depends(get_current_user),
):
    items = (
        db.query(WatchlistItem)
        .filter(WatchlistItem.user_id == current_user.id)
        .order_by(WatchlistItem.added_at.desc())
        .all()
    )
    return WatchlistOut(results=items, total=len(items))


@router.post("/me/watchlist", response_model=WatchlistItemOut, status_code=201)
def add_to_watchlist(
    payload:      WatchlistAdd,
    db:           Session = Depends(get_db),
    current_user: User    = Depends(get_current_user),
):
    already = (
        db.query(WatchlistItem)
        .filter(
            WatchlistItem.user_id       == current_user.id,
            WatchlistItem.tmdb_movie_id == payload.tmdb_movie_id,
        )
        .first()
    )
    if already:
        raise HTTPException(status_code=400, detail="Movie already in your watchlist")

    item = WatchlistItem(
        user_id       = current_user.id,
        tmdb_movie_id = payload.tmdb_movie_id,
        movie_title   = payload.movie_title,
        poster_path   = payload.poster_path,
    )
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


@router.delete("/me/watchlist/{tmdb_movie_id}", status_code=204)
def remove_from_watchlist(
    tmdb_movie_id: str,
    db:            Session = Depends(get_db),
    current_user:  User    = Depends(get_current_user),
):
    item = (
        db.query(WatchlistItem)
        .filter(
            WatchlistItem.user_id       == current_user.id,
            WatchlistItem.tmdb_movie_id == tmdb_movie_id,
        )
        .first()
    )
    if not item:
        raise HTTPException(status_code=404, detail="Movie not in your watchlist")

    db.delete(item)
    db.commit()


@router.get("/{username}/watchlist", response_model=WatchlistOut)
def get_user_watchlist(
    username: str,
    db:       Session = Depends(get_db),
):
    user  = _get_user_or_404(username, db)
    items = (
        db.query(WatchlistItem)
        .filter(WatchlistItem.user_id == user.id)
        .order_by(WatchlistItem.added_at.desc())
        .all()
    )
    return WatchlistOut(results=items, total=len(items))