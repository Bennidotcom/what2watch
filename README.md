# What2Watch

Answer 5 mood questions and get up to 20 personalized movie picks with posters, plot, cast, director, and writer.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3001](http://localhost:3001) (port 3001 avoids conflict with other apps on 3000).

### Movie database (required for best results)

1. Create a free API key at [themoviedb.org/settings/api](https://www.themoviedb.org/settings/api).
2. Copy `.env.example` to `.env.local` and set:

```bash
TMDB_API_KEY=your_key_here
```

The app uses **The Movie Database (TMDB)** — the same data source IMDb is built from. Without this key, only a small offline list is used and you may see fewer than 5 movies.

## GitHub

**Repository:** [github.com/Bennidotcom/what2watch](https://github.com/Bennidotcom/what2watch)

## Deploy to Vercel

### Option A — Import from GitHub (recommended)

1. Open **[vercel.com/new](https://vercel.com/new)** and sign in (GitHub login works well).
2. Click **Import** next to `Bennidotcom/what2watch`.
3. Leave defaults (Next.js, root directory `.`, build `npm run build`).
4. Add environment variable **`TMDB_API_KEY`** (your TMDB API key).
5. Click **Deploy**.

Vercel will rebuild automatically on every push to `main`.

### Option B — Vercel CLI

```bash
npx vercel login
npx vercel --prod
```

### After deploy

- Your site will be at `https://what2watch.vercel.app` (or similar).
- Optional custom domain: Project → **Settings** → **Domains**.

## Stack

- Next.js App Router
- TMDB API for thousands of movies (always 5 per batch, up to 20 total)
- Offline catalog fallback
- Mood-based matching (energy, emotion, setting, audience, era)
