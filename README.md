# What2Watch

Answer 5 mood questions and get up to 20 personalized movie picks with posters, plot, cast, director, and writer.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3001](http://localhost:3001) (port 3001 avoids conflict with other apps on 3000).

## GitHub

**Repository:** [github.com/Bennidotcom/what2watch](https://github.com/Bennidotcom/what2watch)

## Deploy to Vercel

### Option A — Import from GitHub (recommended)

1. Open **[vercel.com/new](https://vercel.com/new)** and sign in (GitHub login works well).
2. Click **Import** next to `Bennidotcom/what2watch`.
3. Leave defaults (Next.js, root directory `.`, build `npm run build`).
4. Click **Deploy**. No environment variables needed.

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
- Curated movie catalog with TMDB poster images
- Mood-based matching (energy, emotion, setting, audience, era)
