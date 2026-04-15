from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth, movies, reviews, users

app = FastAPI(title="CineLog API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "https://your-vercel-app.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router,    prefix="/auth",    tags=["auth"])
app.include_router(movies.router,  prefix="/movies",  tags=["movies"])
app.include_router(reviews.router, prefix="/reviews", tags=["reviews"])
app.include_router(users.router,   prefix="/users",   tags=["users"])

@app.get("/health", tags=["Health"])
def health():
    return {"status": "ok"}