from pydantic import BaseModel
from datetime import datetime
from uuid import UUID


class WatchlistAdd(BaseModel):
    tmdb_movie_id: str
    movie_title: str
    poster_path: str | None = None


class WatchlistItemOut(BaseModel):
    id: UUID
    tmdb_movie_id: str
    movie_title: str
    poster_path: str | None = None
    added_at: datetime

    class Config:
        from_attributes = True


class WatchlistOut(BaseModel):
    results: list[WatchlistItemOut]
    total: int