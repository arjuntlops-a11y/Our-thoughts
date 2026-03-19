# Deploy Arjun & Soumya (Vercel + Neon)

This stack is **free to start**, **easy** (mostly clicking in dashboards), and **fits two people** comfortably: generous limits on [Vercel](https://vercel.com/docs/plans/hobby), [Neon](https://neon.tech/docs/introduction/plans), and [Vercel Blob](https://vercel.com/docs/storage/vercel-blob/usage-and-pricing) for a tiny personal app.

There is no truly “unlimited” free tier anywhere, but for private use by two people you will stay far within hobby limits.

## 1. Push code to GitHub

Create a repo and push this project (`thoughts-app/` or the repo root, as you prefer).

## 2. Neon (Postgres)

1. Sign up at [neon.tech](https://neon.tech).
2. Create a project and database.
3. In the Neon dashboard, open **Connection details** and copy:
   - **Pooled** connection string → use as `DATABASE_URL` on Vercel.
   - **Direct** (non-pooled) connection string → use as `DIRECT_URL` (Prisma uses this for migrations).

Add `?sslmode=require` if not already present.

## 3. Vercel

1. Sign up at [vercel.com](https://vercel.com) and **Import** your GitHub repo.
2. Set the **Root Directory** to `thoughts-app` if the app lives in that folder.
3. Add **Environment variables** (Settings → Environment Variables):

| Name | Value |
|------|--------|
| `DATABASE_URL` | Neon pooled URL |
| `DIRECT_URL` | Neon direct URL |
| `COUPLE_SECRET` | A password only you two know |
| `SESSION_SECRET` | Long random string (e.g. `openssl rand -hex 32`) |
| `BLOB_READ_WRITE_TOKEN` | See step 4 |

4. **Deploy.** The build runs `prisma migrate deploy` and applies the schema to Neon.

## 4. Vercel Blob (photos)

Serverless apps **cannot** rely on saving files to disk; photos go to **Blob** in production.

1. In the Vercel project: **Storage** → **Create** → **Blob**.
2. Link the store to this project. Vercel injects `BLOB_READ_WRITE_TOKEN` automatically for Production (and Preview if you enable it).

**Local development:** leave `BLOB_READ_WRITE_TOKEN` empty. Photos are stored under `public/uploads/` on your machine.

## 5. After deploy

Open your Vercel URL, log in with **Arjun** or **Soumya** and your `COUPLE_SECRET`.

Optional: run the seed on Neon once (from your laptop, with `DATABASE_URL` pointing at Neon):

```bash
cd thoughts-app
npx prisma db seed
```

---

### Local Postgres (optional)

```bash
docker compose up -d
cp .env.example .env
# Edit COUPLE_SECRET and SESSION_SECRET; DATABASE_* match docker-compose.yml
npx prisma migrate dev
npm run dev
```
