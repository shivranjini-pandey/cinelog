from pydantic import BaseModel, Field
from datetime import datetime
from uuid import UUID
from app.schemas.user import UserPublic

class ReviewCreate(BaseModel):
    tmdb_movie_id: str
    movie_title: str
    rating: int = Field(..., ge=1, le=10)  # must be 1-10
    content: str = Field(..., min_length=10, max_length=5000)

class ReviewUpdate(BaseModel):
    rating:  int  | None = Field(None, ge=1, le=10)
    content: str  | None = Field(None, min_length=10, max_length=5000)

class ReviewInsightOut(BaseModel):
    sentiment: str | None  # "positive" | "negative" | "mixed"
    themes: str | None     # "acting, pacing, visuals"
    verdict: str | None    # one short sentence

    class Config:
        from_attributes = True

class ReviewOut(BaseModel):
    id: UUID
    tmdb_movie_id: str
    movie_title: str
    rating: int
    content: str
    created_at: datetime
    updated_at: datetime | None = None
    author: UserPublic
    insights: ReviewInsightOut | None = None

    class Config:
        from_attributes = True

class ReviewListOut(BaseModel):
    results: list[ReviewOut]
    total: int
    page: int
    total_pages: int