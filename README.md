# Savant — Patient Management System

## Setup Instructions

```bash
# Root directory
cp .env.example .env

# Backend
cp backend/.env.example backend/.env

# Run
docker compose up --build -d
```

> **Note:** If you have an OpenAI API key, add it to your `backend/.env` file:
>
> ```
> OPENAI_API_KEY=sk-your-key-here
> ```
>
> This enables the AI-powered patient summary feature. Without it, the summary view will fall back to "Service is not available."

Containers should be up and running.

## URLs

- **Database:** `postgresql://localhost:5432`
- **Backend:** `http://localhost:8000`
- **Frontend:** `http://localhost:5173`

## What I Accomplished + Assumptions

- Named the app **Savant** (all-knowing), thought it'd be cool for a patient management system
- All patient & notes CRUD endpoints
- `last_visit` defaulted to `None`
  - Doesn't guarantee a real visit if tied to notes or creation timestamp
- Pagination on patient list & note list (infinite scrolling)
- Search + filter implemented
- Sorting not completed
- DB: index on first, middle, last name
  - Tradeoff: slower writes, faster reads (search-heavy)
- Expanded address + contact fields
  - Probably overkill, wanted to mimic real-world, could be simpler
- Relationships:
  - One-to-many: allergies, conditions
  - One-to-one: contact, address
- Status: active, inactive, deceased
- Seeded DB + Alembic migrations
- Patient notes endpoints implemented + paginated
- Frontend:
  - Header + Sidebar (simple)
  - Dashboard: total patients + active vs inactive
  - Patient List: add, search (non-blocking), filter (no sorting)
  - Patient View: view/edit patient, manage notes
  - Summary view calls OpenAI, falls back to "Service is not available"
  - 404 page implemented
