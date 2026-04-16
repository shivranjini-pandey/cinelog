import httpx
from app.core.config import settings
from typing import Optional

TMDB_BASE = "https://api.themoviedb.org/3"
OMDB_BASE = "http://www.omdbapi.com"
TMDB_IMG  = "https://image.tmdb.org/t/p/w500"


def _tmdb_headers() -> dict:
    return {"Authorization": f"Bearer {settings.TMDB_API_KEY}"}


def _merge_ratings(tmdb_movie: dict, omdb_data: Optional[dict]) -> dict:
    """
    Takes a raw TMDB movie dict and optional OMDb data,
    returns a clean merged dict ready to send to the frontend.
    """
    imdb_rating   = None
    rt_score      = None
    imdb_id       = tmdb_movie.get("imdb_id") or (omdb_data or {}).get("imdbID")

    if omdb_data and omdb_data.get("Response") == "True":
        imdb_rating = omdb_data.get("imdbRating")        # e.g. "8.3"
        for source in omdb_data.get("Ratings", []):
            if source["Source"] == "Rotten Tomatoes":
                rt_score = source["Value"]               # e.g. "94%"

    genres = [g["name"] for g in tmdb_movie.get("genres", [])]
    # search results use genre_ids; detail endpoint uses genres
    if not genres and tmdb_movie.get("genre_ids"):
        genres = tmdb_movie["genre_ids"]                 # raw ids, resolved in search

    runtime = tmdb_movie.get("runtime")                  # minutes, None for search results

    return {
        "tmdb_id":       str(tmdb_movie["id"]),
        "title":         tmdb_movie.get("title", ""),
        "overview":      tmdb_movie.get("overview", ""),
        "poster_url":    f"{TMDB_IMG}{tmdb_movie['poster_path']}"
                         if tmdb_movie.get("poster_path") else None,
        "release_date":  tmdb_movie.get("release_date"),
        "runtime":       runtime,
        "genres":        genres,
        "imdb_id":       imdb_id,
        "imdb_rating":   imdb_rating,
        "rt_score":      rt_score,
        "tmdb_rating":   round(tmdb_movie.get("vote_average", 0), 1),
    }


async def search_movies(query: str, page: int = 1) -> dict:
    async with httpx.AsyncClient() as client:
        resp = await client.get(
            f"{TMDB_BASE}/search/movie",
            headers=_tmdb_headers(),
            params={"query": query, "page": page, "include_adult": False},
        )
        resp.raise_for_status()
        data = resp.json()

    results = [_merge_ratings(m, None) for m in data.get("results", [])]
    return {
        "results":       results,
        "page":          data.get("page", 1),
        "total_pages":   data.get("total_pages", 1),
        "total_results": data.get("total_results", 0),
    }


async def get_movies_by_genre(genre_id: int, page: int = 1) -> dict:
    async with httpx.AsyncClient() as client:
        resp = await client.get(
            f"{TMDB_BASE}/discover/movie",
            headers=_tmdb_headers(),
            params={
                "with_genres":          genre_id,
                "page":                 page,
                "sort_by":              "popularity.desc",
                "include_adult":        False,
                "vote_count.gte":       50,        # filter out obscure films
            },
        )
        resp.raise_for_status()
        data = resp.json()

    results = [_merge_ratings(m, None) for m in data.get("results", [])]
    return {
        "results":       results,
        "page":          data.get("page", 1),
        "total_pages":   data.get("total_pages", 1),
        "total_results": data.get("total_results", 0),
    }


async def get_movie_detail(tmdb_id: int) -> dict:
    """
    Fetches full TMDB detail (includes runtime, genres, imdb_id),
    then fires a second request to OMDb for RT + IMDb ratings.
    Both run concurrently with httpx async.
    """
    async with httpx.AsyncClient() as client:
        tmdb_resp = await client.get(
            f"{TMDB_BASE}/movie/{tmdb_id}",
            headers=_tmdb_headers(),
            params={"append_to_response": "credits"},
        )
        tmdb_resp.raise_for_status()
        tmdb_data = tmdb_resp.json()

        # now we have the imdb_id, fire OMDb
        omdb_data = None
        imdb_id = tmdb_data.get("imdb_id")
        if imdb_id and settings.OMDB_API_KEY not in ("get_this_later", ""):
            omdb_resp = await client.get(
                OMDB_BASE,
                params={"i": imdb_id, "apikey": settings.OMDB_API_KEY},
            )
            if omdb_resp.status_code == 200:
                omdb_data = omdb_resp.json()

    merged = _merge_ratings(tmdb_data, omdb_data)

    # add cast (top 10)
    credits = tmdb_data.get("credits", {})
    cast = [
        {"name": m["name"], "character": m["character"]}
        for m in credits.get("cast", [])[:10]
    ]
    merged["cast"] = cast

    return merged


async def get_genre_list() -> list[dict]:
    async with httpx.AsyncClient() as client:
        resp = await client.get(
            f"{TMDB_BASE}/genre/movie/list",
            headers=_tmdb_headers(),
        )
        resp.raise_for_status()
        return resp.json().get("genres", [])


async def get_trending(time_window: str = "week") -> dict:
    async with httpx.AsyncClient() as client:
        resp = await client.get(
            f"{TMDB_BASE}/trending/movie/{time_window}",
            headers=_tmdb_headers(),
        )
        resp.raise_for_status()
        data = resp.json()

    results = [_merge_ratings(m, None) for m in data.get("results", [])]
    return {"results": results}