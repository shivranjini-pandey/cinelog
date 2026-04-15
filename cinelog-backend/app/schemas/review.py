from pydantic import BaseModel, Field
from datetime import datetime
from uuid import UUID

class ReviewCreate(BaseModel):
    tmdb_movie_id: str
    movie_title: str
    rating: int = Field(..., ge=1, le=10)  # must be 1-10
    content: str = Field(..., min_length=10)

class ReviewInsightOut(BaseModel):
    sentiment: str | None
    themes: str | None
    verdict: str | None

class ReviewOut(BaseModel):
    id: UUID
    tmdb_movie_id: str
    movie_title: str
    rating: int
    content: str
    created_at: datetime
    author: "UserPublic"
    insights: ReviewInsightOut | None

    class Config:
        from_attributes = True