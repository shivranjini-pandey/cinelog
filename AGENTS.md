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
- **Backend needs `cinelog-backend/.env`** (git-ignored). Required keys: `DATABASE_URL`, `SECRET_KEY`, `TMDB_API_KEY`, `OMDB_API_KEY`, `OPENAI_API_KEY`. The working dev value for the DB is `DATABASE_URL=postgresql://postgres:postgres@localhost:5432/cinelog`. If `.env` is missing (e.g. fresh checkout), the backend fails to import because `app/core/config.py` has no defaults for these fields.
- **Config reads `OPENAI_API_KEY`, not `ANTHROPIC_API_KEY`.** `.env.example` is misleading — `app/core/config.py` requires `OPENAI_API_KEY`.
- **External API keys are placeholders** (`get_this_later`) in dev. Auth (register/login/profile) works fully without real keys. Movie browsing/search/detail require a valid `TMDB_API_KEY`; OMDb ratings and AI review insights degrade gracefully when their keys are absent.
- **Database tables are auto-created** on backend startup via `Base.metadata.create_all` in `app/main.py`. `alembic` is not in `requirements.txt`, so migrations are optional for local dev.
- **Frontend uses `VITE_API_URL`** (set in `cinelog-frontend/.env` to `http://localhost:8000`) as the axios base URL; the `/api` proxy in `vite.config.js` is unused by the current service code.
- **`npm run lint` reports pre-existing errors** in app source (e.g. `Profile.jsx`, `Search.jsx`); these are not caused by environment setup.
