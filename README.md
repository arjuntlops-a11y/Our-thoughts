# Arjun & Soumya — couple space

Photos, feelings, bucket list, special dates, and a **miss-you** slideshow — with a real **Postgres** backend and **Vercel Blob** for images in production.

## Quick start (local)

```bash
cd thoughts-app
docker compose up -d
cp .env.example .env
```

Edit `.env`: set `COUPLE_SECRET`, `SESSION_SECRET`, and keep the default `DATABASE_URL` / `DIRECT_URL` if using Docker.

```bash
npm install
npx prisma migrate dev
npx prisma db seed   # optional
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Without Docker, use a [Neon](https://neon.tech) dev database and paste both connection strings into `.env`.

## Deploy (recommended)

See **[DEPLOY.md](./DEPLOY.md)** for **Vercel + Neon + Vercel Blob** (free tiers, good for two people, no server babysitting).

## Stack

- Next.js (App Router) · Prisma · PostgreSQL
- Images: local `public/uploads/` in dev; **Vercel Blob** when `BLOB_READ_WRITE_TOKEN` is set
- Auth: shared secret + signed session cookie (`jose`)

## Scripts

| Command | Purpose |
|--------|---------|
| `npm run dev` | Development |
| `npm run build` | Production build (runs migrations) |
| `npm run start` | Start production server |

---

Made with love for Arjun & Soumya.
