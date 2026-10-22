# HealthHub

HealthHub is a small Next.js app for Supabase Authentication: sign up, confirm
an email, log in, reset a password, and log out. The frontend talks directly
to Supabase Auth; there is no custom API or service-role key in this project.

## Stack

- Next.js 14 App Router, React, TypeScript, and TailwindCSS
- Supabase Auth via `@supabase/supabase-js`
- Docker Compose for the frontend container

## Supabase setup

1. Create a Supabase project.
2. Copy the project URL and anon key into `frontend/.env.local`:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

3. Configure email confirmation in **Authentication → Providers → Email**.
4. Add these URLs in **Authentication → URL Configuration**:
   - `http://localhost:3000`
   - `http://localhost:3000/auth/reset-password`
   - Your deployed app origin and `/auth/reset-password` equivalent.

The optional [database/schema.sql](./database/schema.sql) creates a minimal
profile table. Supabase Auth itself does not require any project table.

## Local development

```bash
cd frontend
copy .env.local.example .env.local
npm install
npm run dev
```

Open `http://localhost:3000`.

## Production build

```bash
cd frontend
npm install
npm run build
```

HealthHub provides general information and is not a substitute for
professional medical advice.
