from fastapi import APIRouter, HTTPException, Query
from app.services.movie_service import (
    search_movies,
    get_movies_by_genre,
    get_movie_detail,
    get_genre_list,
    get_trending,
)

router = APIRouter()


@router.get("/search")
async def search(
    q: str = Query(..., min_length=1, description="Movie title to search"),
    page: int = Query(1, ge=1),
):
    try:
        return await search_movies(q, page)
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"TMDB error: {str(e)}")


@router.get("/genres")
async def list_genres():
    try:
        return await get_genre_list()
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"TMDB error: {str(e)}")


@router.get("/by-genre")
async def by_genre(
    genre_id: int = Query(..., description="TMDB genre ID"),
    page: int = Query(1, ge=1),
):
    try:
        return await get_movies_by_genre(genre_id, page)
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"TMDB error: {str(e)}")


@router.get("/trending")
async def trending(
    time_window: str = Query("week", pattern="^(day|week)$"),
):
    try:
        return await get_trending(time_window)
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"TMDB error: {str(e)}")


@router.get("/{tmdb_id}")
async def movie_detail(tmdb_id: int):
    try:
        return await get_movie_detail(tmdb_id)
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"TMDB error: {str(e)}")