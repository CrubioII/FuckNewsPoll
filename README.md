# F*cks News Poll

Real-time voting app for live comedy events. The audience votes from their phones, results update instantly on screen, and the comedians control the whole thing from their own devices.

Built for Camilo Pardo (Mago) vs Camilo Sánchez — but works for any event they run.

## How it works

Two URLs:

- **`/`** — Public link sent to the audience. Shows a waiting screen until the round starts, then two vote buttons appear. One vote per device.
- **`/admin?token=SECRET`** — Private link bookmarked on the comedians' phones. Has the start/stop/reset controls and shows live vote counts with exact numbers.

When someone on stage hits "Iniciar Batalla", every phone in the room switches from the waiting screen to voting mode in under a second. No refresh needed.

## Stack

- React + TypeScript + Vite
- Tailwind CSS
- Supabase (Postgres + Realtime subscriptions)
- Supabase Edge Functions (admin actions)
- PWA (works as an installable app, fast on mobile data)

## Setup

### 1. Supabase

Create a project at [supabase.com](https://supabase.com), then run the SQL in `supabase/schema.sql` from the SQL Editor.

Enable Realtime on both tables: Dashboard → Database → Publications → `supabase_realtime` → toggle on `votos` and `app_state`.

### 2. Environment

Copy your project URL and anon key into `.env.local`:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Edge Function

```bash
npm install -g supabase
supabase login
supabase link --project-ref your-project-ref
supabase secrets set ADMIN_TOKEN=your-secret-token
supabase functions deploy admin-action
```

The admin token is whatever string you want. Keep it somewhere safe — it goes in the URL the comedians bookmark.

### 4. Run

```bash
npm install
npm run dev
```

## Admin URL

After deploying, the admin link looks like:

```
https://your-app.com/admin?token=your-secret-token
```

Bookmark it on the phones before the show.

## Vote deduplication

Each device gets a UUID stored in localStorage. That ID is sent with every vote and has a unique constraint in the database, so even if someone clears the page and tries again, the second insert fails silently and the UI shows them as already voted.

When a new round starts, the voted flag resets automatically.
