# AGENTS.md

## Cursor Cloud specific instructions

CineLog is a full-stack app with two services plus a database:

| Service | Location | Dev command | URL |
| --- | --- | --- | --- |
| Backend (FastAPI) | `cinelog-backend` | `./venv/bin/uvicorn app.main:app --reload --host 0.0.0.0 --port 8000` | http://localhost:8000 (`/docs`, `/health`) |
| Frontend (React/Vite) | `cinelog-frontend` | `npm run dev` | http://localhost:5173 |
| PostgreSQL 16 | system service | `sudo pg_ctlcluster 16 main start` | localhost:5432 |

Standard build/lint/test commands live in `cinelog-frontend/package.json` (`npm run build`, `npm run lint`) and the README. There is no automated test suite in this repo.

### Non-obvious caveats

- **Start PostgreSQL before the backend.** It does not auto-start: `sudo pg_ctlcluster 16 main start`. The dev database is `cinelog`, owned by role `postgres` with password `postgres`.
- **Backend needs `cinelog-backend/.env`** (git-ignored). Required settings: `DATABASE_URL`, `SECRET_KEY`, `TMDB_API_KEY`, `OMDB_API_KEY`, `OPENAI_API_KEY`. `app/core/config.py` uses pydantic-settings, which reads real environment variables first and then `.env`. `TMDB_API_KEY`, `OMDB_API_KEY`, and `OPENAI_API_KEY` are provided as Cursor secrets (injected as env vars), so they resolve automatically. `DATABASE_URL` and `SECRET_KEY` are NOT secrets and must live in `.env` (working dev DB value: `postgresql://postgres:postgres@localhost:5432/cinelog`). If none of these are present, the backend fails to import because the config has no defaults.
- **Config reads `OPENAI_API_KEY`, not `ANTHROPIC_API_KEY`.** `.env.example` is misleading — `app/core/config.py` requires `OPENAI_API_KEY`.
- **TMDB uses a v4 Bearer token** (the long JWT-style key), sent as `Authorization: Bearer <key>`, not the short v3 API key.
- **External features verified working** with the provided keys: movie browse/search/detail (TMDB), IMDb/Rotten Tomatoes ratings (OMDb), and AI review insights (OpenAI `gpt-4o-mini`). Auth/profile flows also work without any external keys; OMDb/AI degrade gracefully if their keys are absent.
- **Database tables are auto-created** on backend startup via `Base.metadata.create_all` in `app/main.py`. `alembic` is not in `requirements.txt`, so migrations are optional for local dev.
- **Frontend uses `VITE_API_URL`** (set in `cinelog-frontend/.env` to `http://localhost:8000`) as the axios base URL; the `/api` proxy in `vite.config.js` is unused by the current service code.
- **`npm run lint` reports pre-existing errors** in app source (e.g. `Profile.jsx`, `Search.jsx`); these are not caused by environment setup.
