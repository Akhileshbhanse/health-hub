# HealthHub

HealthHub is a full-stack health and hygiene platform. The Next.js frontend
uses Supabase Auth and Storage, while the Express API provides authenticated
REST endpoints for tips, uploads, and personalized recommendations.

## Stack

- **Frontend:** Next.js 14 App Router, React, TypeScript, TailwindCSS
- **Backend:** Node.js 20, Express, TypeScript, Multer
- **Data and auth:** Supabase PostgreSQL, Auth, and Storage
- **Deployment:** Vercel (frontend), Render/Heroku (backend), or Docker Compose

## Project structure

```text
health hub/
├── frontend/                 # Next.js application
│   ├── src/app/              # Home, tips, dashboard, uploads, auth
│   ├── src/components/       # Shared navigation, footer, and cards
│   └── src/lib/              # Supabase and API clients
├── backend/                  # Express REST API
│   └── src/
│       ├── middleware/       # Bearer-token authentication
│       ├── config.ts
│       ├── server.ts
│       └── supabase.ts
├── database/schema.sql       # Tables, RLS, seed tips, and storage policies
├── docker-compose.yml
└── README.md
```

## Supabase setup

1. Create a project at [supabase.com](https://supabase.com).
2. Copy the project URL, anon key, and service-role key from **Project
   Settings → API**.
3. Run [`database/schema.sql`](./database/schema.sql) in the Supabase SQL
   Editor. It creates the profile, tips, uploads, and recommendations tables,
   RLS policies, the `uploads` storage bucket, and sample tips.
4. Keep `SUPABASE_SERVICE_ROLE_KEY` server-only. Never expose it through
   `NEXT_PUBLIC_*` variables or commit it.
5. In Auth settings, configure the email confirmation behavior and allowed
   redirect URLs for your frontend.

## Local development

### Frontend

```bash
cd frontend
copy .env.local.example .env.local
npm install
npm run dev
```

Set these values in `frontend/.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_API_URL=http://localhost:4000
```

### Backend

```bash
cd backend
copy .env.example .env
npm install
npm run dev
```

Set the Supabase values in `backend/.env`. The backend listens on
`http://localhost:4000` and exposes `GET /health`.

## REST API

All protected routes expect `Authorization: Bearer <supabase-access-token>`.

| Method | Endpoint | Auth | Purpose |
| --- | --- | --- | --- |
| GET | `/health` | No | API health check |
| POST | `/api/auth/register` | No | Register with Supabase Auth |
| POST | `/api/auth/login` | No | Login with Supabase Auth |
| GET | `/api/tips` | No | List tips; optional `?category=` |
| GET | `/api/tips/:id` | No | Read one tip |
| GET | `/api/uploads` | Yes | List the current user's uploads |
| POST | `/api/uploads` | Yes | Multipart upload (`file`, optional `description`) |
| DELETE | `/api/uploads/:id` | Yes | Delete an owned upload and storage object |
| GET | `/api/recommendations` | Yes | List current-user recommendations |
| POST | `/api/recommendations/generate` | Yes | Create a rule-based recommendation |
| POST | `/api/ai/analyze` | Yes | Reserved AI analysis placeholder (501) |

The recommendation endpoint intentionally uses dummy rule-based logic for now.
The AI endpoint is a safe integration seam for a future image/report analysis
provider and does not claim to provide medical advice.

## Docker Compose

Create `backend/.env`, then create a root `.env` containing the public frontend
values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_API_URL=http://localhost:4000
```

Start both services from the project root:

```bash
docker compose up --build
```

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:4000`

## Deployment

### Vercel

Create a Vercel project with `frontend` as the root directory. Add
`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and the deployed
backend URL as `NEXT_PUBLIC_API_URL`.

### Render or Heroku

Deploy `backend` as a Node service:

```text
Build command: npm ci && npm run build
Start command: npm start
```

Configure `SUPABASE_URL`, `SUPABASE_ANON_KEY`,
`SUPABASE_SERVICE_ROLE_KEY`, `FRONTEND_URL`, and
`SUPABASE_STORAGE_BUCKET`. Set `FRONTEND_URL` to the exact deployed frontend
origin so CORS remains restricted.

## Validation

```bash
cd backend && npm run typecheck
cd ../frontend && npm run build
```

HealthHub provides educational hygiene information and is not a substitute for
professional medical diagnosis or treatment.
