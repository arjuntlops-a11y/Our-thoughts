# Deploy so you & your partner can use it anytime

You’ll host the app on **Vercel** (always-on HTTPS URL), store data in **Neon** (Postgres), and put photos in **Vercel Blob**. Free tiers are enough for two people using it daily.

**Time:** ~15 minutes once accounts exist.

---

## Before you start

1. Code is on **GitHub** (e.g. [Our-thoughts](https://github.com/arjuntlops-a11y/Our-thoughts)).
2. Pick a **shared password** only you two know → this becomes `COUPLE_SECRET` (same idea as login today).
3. **Repo layout on GitHub** (important for Vercel):
   - If **`package.json` is at the repo root** → in Vercel leave **Root Directory** **empty** (or `.`).
   - If the app is inside a folder like **`thoughts-app/`** → set **Root Directory** to `thoughts-app`.

---

## Step A — Neon (database)

1. Go to [neon.tech](https://neon.tech) and sign up.
2. **Create project** → create a database (default is fine).
3. Open **Connection details** (or Dashboard → your branch → Connect).
4. Copy the **pooled** connection string (host often contains `-pooler`) → this is **`DATABASE_URL`** on Vercel.  
   It should include SSL (`sslmode=require`). Prisma is configured so **only `DATABASE_URL`** is required (no separate `DIRECT_URL`).

---

## Step B — Vercel (hosting)

1. Go to [vercel.com](https://vercel.com) → **Add New** → **Project** → **Import** your GitHub repo.
2. Set **Root Directory** as in “Before you start” above.
3. **Before first deploy**, open **Environment Variables** and add:

| Name | Value |
|------|--------|
| `DATABASE_URL` | Neon **pooled** URL (from Neon dashboard) |
| `COUPLE_SECRET` | Your shared login password (only you two know) |
| `SESSION_SECRET` | Long random secret (e.g. run `openssl rand -hex 32` in Terminal) |

   Select **Production** (and **Preview** if you want preview deploys to work too).

4. Click **Deploy**.  
   - Build runs `prisma migrate deploy` and creates tables on Neon.  
   - If the build fails, check that both DB URLs are correct and Neon allows your IP (Neon is usually open to the world with SSL).

---

## Step C — Blob (photos in production) — **required**

Without Blob, **photo uploads will not work** on Vercel (there is no persistent disk). The app will show an error until Blob is configured.

1. In the Vercel project: **Storage** → **Create** → **Blob** → create a store.
2. **Connect** it to this project.  
   Vercel injects **`BLOB_READ_WRITE_TOKEN`** for Production (and Preview if you link it).
3. **Redeploy** (Deployments → … → Redeploy) so the new variable is picked up.

---

## Step D — Use it together

1. Open your live URL: **`https://your-project.vercel.app`** (or your custom domain).
2. **Bookmark it** on both phones.
3. **Share `COUPLE_SECRET`** with your gf only (Signal, in person, etc.) — never commit it to git.
4. Log in as **Arjun** or **Soumya**; the app remembers the session on that device for a while.

### Optional: custom domain

Vercel → **Settings** → **Domains** → add a domain you own (Namecheap, Cloudflare, etc.) and follow DNS instructions.

---

## Optional: seed cute starter lines

From your laptop, point at Neon (copy `DATABASE_URL` from Vercel or Neon into a temp `.env` or export in shell):

```bash
cd thoughts-app
DATABASE_URL="postgresql://..." npx prisma db seed
```

---

## Troubleshooting

| Issue | What to check |
|--------|----------------|
| Build fails on `prisma migrate` | `DATABASE_URL` wrong or missing; Neon project paused; SSL params. |
| Login works but photos disappear | **Blob** not connected + `BLOB_READ_WRITE_TOKEN` missing → do Step C + redeploy. |
| 401 on login | `COUPLE_SECRET` on Vercel doesn’t match what you type. |

---

## Local dev vs production

- **Local:** Docker Postgres + `.env` on your machine (see `README.md`).
- **Production:** Neon + Vercel + Blob — **no** need to keep your laptop on for the site to work.
