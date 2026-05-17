# What2Watch

Answer 5 mood questions and get up to 20 personalized movie picks with posters, plot, cast, director, and writer.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3001](http://localhost:3001) (port 3001 avoids conflict with other apps on 3000).

## Deploy to Vercel

1. Push this project to GitHub (root = this folder).
2. Go to [vercel.com/new](https://vercel.com/new) and import the repository.
3. **Framework preset:** Next.js (auto-detected).
4. **Build command:** `npm run build` (default).
5. **Output:** default — no custom output directory.
6. Deploy. No environment variables required.

### After deploy

- Production URL will be `https://<project>.vercel.app`.
- Optional: add a custom domain under Project → Settings → Domains.

## Stack

- Next.js App Router
- Curated movie catalog with TMDB poster images
- Mood-based matching (energy, emotion, setting, audience, era)
