# CineLog — A Movie Review Platform

A full-stack movie review and discovery platform inspired by Letterboxd. Built with modern web technologies, featuring user authentication, AI-powered review insights, and a dark theme UI.

**Live Demo:** [cinelog.co](https://cinelog.co)

![Python](https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54) ![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E) ![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB) ![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white) ![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi) ![PostgreSQL](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white) ![Chatgpt](https://img.shields.io/badge/ChatGPT-74aa9c?style=for-the-badge&logo=openai&logoColor=white) ![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E) ![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white) ![Render](https://img.shields.io/badge/Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)

---

## Screenshots

### Login Page

- **![Login]** <img src="./assets/login.png" width="400"/>

### Home Page

- **![Home]** <img src="./assets/home.png" width="400"/>

### Search

- **![Search]** <img src="./assets/search.png" width="400"/>

### Review

- **![Review]** <img src="./assets/review.png" width="400"/>

---

## Features

### Core Functionality

- **User Authentication** — Secure registration and JWT-based login
- **Movie Discovery** — Browse trending movies, filter by genre, search by title
- **Movie Details** — View ratings (IMDb, Rotten Tomatoes, TMDB), cast, synopsis, runtime
- **Review System** — Write and read reviews with star ratings (1-10)
- **AI Insights** — Automatic sentiment analysis and theme detection on reviews using ChatGPT
- **Watchlist** — Save movies to watch later
- **User Profiles** — View public profiles with review history and bio

### Advanced Features

- **Pagination** — Efficient data loading with page navigation
- **Real-time Search** — Search movies with debouncing
- **Responsive Design** — Works on desktop, tablet, and mobile
- **Dark Theme** — Cinema-inspired dark UI with emerald accents
- **Error Handling** — Graceful error messages and fallbacks

---

## Tech Stack

### Frontend

- **React 18** — UI component library
- **Vite** — Lightning-fast build tool and dev server
- **Tailwind CSS** — Utility-first styling
- **React Router** — Client-side routing
- **Axios** — HTTP client with interceptors
- **Context API** — Global state management

### Backend

- **FastAPI** — Modern Python web framework
- **PostgreSQL** — Relational database
- **SQLAlchemy** — ORM for database queries
- **Alembic** — Database migration tool
- **JWT** — Stateless authentication
- **Pydantic** — Data validation

### External APIs

- **TMDB (The Movie Database)** — Movie data, posters, ratings, genres
- **OMDb API** — IMDb and Rotten Tomatoes ratings
- **OpenAI API** / **Anthropic Claude** — Review sentiment analysis

### Deployment

- **Vercel** — Frontend hosting
- **Railway** — Backend hosting and PostgreSQL database

---

## Getting Started

### Local Setup

#### 1. Clone the repository

```bash
git clone https://github.com/shivranjini-pandey/cinelog.git
cd cinelog
```

#### 2. Set up the backend

```bash
cd cinelog-backend
python -m venv venv

# Activate virtual environment
source venv/bin/activate          # Mac/Linux
venv\Scripts\activate             # Windows

# Install dependencies
pip install -r requirements.txt

# Create .env file
cat > .env << EOF
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/cinelog
SECRET_KEY=$(python -c "import secrets; print(secrets.token_hex(32))")
TMDB_API_KEY=your_tmdb_api_key
OMDB_API_KEY=your_omdb_api_key
OPENAI_API_KEY=your_openai_api_key
EOF

# Run database migrations
alembic upgrade head

# Start the backend server
uvicorn app.main:app --reload
```

Backend will be available at `http://localhost:8000`

View API documentation at `http://localhost:8000/docs`

#### 3. Set up the frontend

```bash
cd ../cinelog-frontend
npm install

# Create .env file
echo "VITE_API_URL=http://localhost:8000" > .env

# Start the dev server
npm run dev
```

Frontend will be available at `http://localhost:5173`

#### 4. Test the app

1. Backend tested via Swagger (/docs)
2. Frontend tested using browser + network tools

---

## Roadmap

1. Deploy backend (Render)
2. Deploy frontend (Vercel)
3. Improve UI animations
4. Add social features (likes, comments, etc.)

---

## Performance Optimizations

- **Lazy loading** — Images load only when visible
- **Debouncing** — Search input debounced to reduce API calls
- **Code splitting** — React Router lazy loads pages
- **Caching** — Browser caches API responses
- **Compression** — Gzip compression on all endpoints
- **CDN** — Vercel auto-serves static assets from global CDN

---

## Security Features

- **JWT Authentication** — Stateless, secure token-based auth
- **Password Hashing** — bcrypt with salt for password storage
- **CORS** — Configured to only accept requests from frontend domain
- **Environment Variables** — All secrets stored in `.env`, never in code
- **SQL Injection Protection** — SQLAlchemy ORM prevents SQL injection
- **Rate Limiting** — Can be added to prevent brute force attacks

---

## Troubleshooting

### Frontend can't connect to backend

- Check `VITE_API_URL` is correct
- Ensure backend is running
- Check CORS is enabled in FastAPI
- Look at Network tab in DevTools for actual error

### Movies aren't loading

- Verify TMDB API key is valid
- Check backend logs for API errors
- Make sure internet connection works

### Reviews aren't saving

- Check user is authenticated (token in localStorage)
- Look at Network tab for 401/403 errors
- Check OpenAI key is valid (if using AI insights)

### Database errors

- Verify PostgreSQL is running
- Check DATABASE_URL is correct
- Run `alembic upgrade head` to apply migrations

---

## Author

**Shivranjini Pandey**

- GitHub: [@shivranjini-pandey](https://github.com/shivranjini-pandey)

---

## Acknowledgments

- Inspired by [Letterboxd](https://letterboxd.com)
- Movie data from [TMDB](https://www.themoviedb.org)
- Ratings from [OMDb](http://www.omdbapi.com)
- AI insights powered by [OpenAI](https://openai.com)

---

## Status

🚀 **Live and actively maintained**

Last updated: April 2026

---
