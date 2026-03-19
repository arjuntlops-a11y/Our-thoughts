"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { MissYouModal } from "./MissYouModal";

type Photo = {
  id: string;
  url: string;
  caption: string | null;
  author: string;
  createdAt: string;
};

type Feeling = { id: string; content: string; author: string; createdAt: string };
type BucketItem = { id: string; text: string; done: boolean; author: string; createdAt: string };
type SpecialDateRow = {
  id: string;
  title: string;
  date: string;
  note: string | null;
  author: string | null;
  createdAt: string;
};
type MissMsg = { id: string; text: string; author: string; createdAt: string };

export function HomeClient() {
  const router = useRouter();
  const [user, setUser] = useState<string | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [feelings, setFeelings] = useState<Feeling[]>([]);
  const [bucket, setBucket] = useState<BucketItem[]>([]);
  const [dates, setDates] = useState<SpecialDateRow[]>([]);
  const [missMsgs, setMissMsgs] = useState<MissMsg[]>([]);
  const [feelText, setFeelText] = useState("");
  const [bucketText, setBucketText] = useState("");
  const [dateTitle, setDateTitle] = useState("");
  const [dateValue, setDateValue] = useState("");
  const [dateNote, setDateNote] = useState("");
  const [missText, setMissText] = useState("");
  const [caption, setCaption] = useState("");
  const [busy, setBusy] = useState(false);
  const [missOpen, setMissOpen] = useState(false);

  const api = useCallback(
    async (path: string, init?: RequestInit) => {
      const res = await fetch(path, { ...init, credentials: "include" });
      return res;
    },
    [],
  );

  const load = useCallback(async () => {
    const me = await api("/api/auth/me");
    const mj = await me.json();
    if (!mj.user) {
      router.replace("/");
      return;
    }
    setUser(mj.user.name);

    const [p, f, b, d, m] = await Promise.all([
      api("/api/photos"),
      api("/api/feelings"),
      api("/api/bucket"),
      api("/api/dates"),
      api("/api/miss-messages"),
    ]);

    if (p.ok) {
      const j = await p.json();
      setPhotos(j.photos ?? []);
    }
    if (f.ok) {
      const j = await f.json();
      setFeelings(j.feelings ?? []);
    }
    if (b.ok) {
      const j = await b.json();
      setBucket(j.items ?? []);
    }
    if (d.ok) {
      const j = await d.json();
      setDates(j.dates ?? []);
    }
    if (m.ok) {
      const j = await m.json();
      setMissMsgs(j.messages ?? []);
    }
  }, [api, router]);

  useEffect(() => {
    load();
  }, [load]);

  async function logout() {
    await api("/api/auth/logout", { method: "POST" });
    router.replace("/");
  }

  async function uploadPhoto(file: File | null) {
    if (!file) return;
    setBusy(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      if (caption.trim()) fd.append("caption", caption.trim());
      const res = await fetch("/api/photos", { method: "POST", body: fd, credentials: "include" });
      if (res.ok) {
        setCaption("");
        await load();
      }
    } finally {
      setBusy(false);
    }
  }

  async function addFeeling(e: React.FormEvent) {
    e.preventDefault();
    if (!feelText.trim()) return;
    setBusy(true);
    try {
      const res = await api("/api/feelings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: feelText }),
      });
      if (res.ok) {
        setFeelText("");
        await load();
      }
    } finally {
      setBusy(false);
    }
  }

  async function addBucket(e: React.FormEvent) {
    e.preventDefault();
    if (!bucketText.trim()) return;
    setBusy(true);
    try {
      const res = await api("/api/bucket", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: bucketText }),
      });
      if (res.ok) {
        setBucketText("");
        await load();
      }
    } finally {
      setBusy(false);
    }
  }

  async function toggleBucket(id: string, done: boolean) {
    await api(`/api/bucket/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ done: !done }),
    });
    await load();
  }

  async function removeBucket(id: string) {
    await api(`/api/bucket/${id}`, { method: "DELETE" });
    await load();
  }

  async function addDate(e: React.FormEvent) {
    e.preventDefault();
    if (!dateTitle.trim() || !dateValue) return;
    setBusy(true);
    try {
      const res = await api("/api/dates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: dateTitle, date: dateValue, note: dateNote || null }),
      });
      if (res.ok) {
        setDateTitle("");
        setDateValue("");
        setDateNote("");
        await load();
      }
    } finally {
      setBusy(false);
    }
  }

  async function removeDate(id: string) {
    await api(`/api/dates/${id}`, { method: "DELETE" });
    await load();
  }

  async function addMiss(e: React.FormEvent) {
    e.preventDefault();
    if (!missText.trim()) return;
    setBusy(true);
    try {
      const res = await api("/api/miss-messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: missText }),
      });
      if (res.ok) {
        setMissText("");
        await load();
      }
    } finally {
      setBusy(false);
    }
  }

  async function removeMiss(id: string) {
    await api(`/api/miss-messages/${id}`, { method: "DELETE" });
    await load();
  }

  async function removePhoto(id: string) {
    await api(`/api/photos/${id}`, { method: "DELETE" });
    await load();
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center text-lg font-bold text-purple-900/70">
        Loading your little world…
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <MissYouModal open={missOpen} onClose={() => setMissOpen(false)} />

      <header className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-extrabold uppercase tracking-[0.25em] text-pink-500">Hi {user}</p>
          <h1 className="mt-1 text-4xl font-extrabold text-purple-950 sm:text-5xl">Our cozy space</h1>
          <p className="mt-2 max-w-xl text-lg font-semibold text-purple-900/75">
            For photos, soft feelings, bucket-list dreams, dates that matter — and a button for when the heart misses its person.
          </p>
        </div>
        <button
          type="button"
          onClick={logout}
          className="self-start rounded-2xl bg-white/70 px-5 py-2.5 text-sm font-extrabold text-purple-900 shadow-sm ring-1 ring-pink-200/80 transition hover:bg-white"
        >
          Log out
        </button>
      </header>

      <motion.section
        className="mb-10 rounded-[2rem] bg-gradient-to-br from-pink-400 via-rose-400 to-violet-500 p-[1px] shadow-xl shadow-pink-300/40"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="rounded-[1.95rem] bg-white/90 px-6 py-6 sm:px-8 sm:py-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-extrabold text-purple-950">Missing each other?</h2>
              <p className="mt-1 font-semibold text-purple-900/70">Tap for a tiny show of your photos and sweet notes.</p>
            </div>
            <button
              type="button"
              onClick={() => setMissOpen(true)}
              className="animate-pulse-soft inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-pink-500 to-violet-600 px-6 py-4 text-lg font-extrabold text-white shadow-lg"
            >
              <span className="text-2xl">💌</span> Open the miss-you moment
            </button>
          </div>
        </div>
      </motion.section>

      <div className="grid gap-8 lg:grid-cols-2">
        <Section title="Photo wall" subtitle="Little memories, big smiles.">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end">
            <label className="flex flex-1 flex-col text-sm font-bold text-purple-900/80">
              Caption (optional)
              <input
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="mt-1 rounded-2xl border border-white/60 bg-white/80 px-3 py-2 font-semibold text-purple-950 shadow-inner outline-none ring-2 ring-transparent focus:ring-pink-300"
                placeholder="e.g. That sunset with you"
              />
            </label>
            <label className="inline-flex cursor-pointer items-center justify-center rounded-2xl bg-gradient-to-r from-pink-500 to-fuchsia-500 px-5 py-3 text-sm font-extrabold text-white shadow-md hover:brightness-105">
              {busy ? "Uploading…" : "Upload a photo"}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                disabled={busy}
                onChange={(e) => uploadPhoto(e.target.files?.[0] ?? null)}
              />
            </label>
          </div>
          {photos.length === 0 ? (
            <Empty hint="Upload your first photo — the miss-you moment will love it." />
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {photos.map((ph) => (
                <figure key={ph.id} className="group relative overflow-hidden rounded-2xl bg-white/60 shadow-sm ring-1 ring-white/80">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={ph.url} alt="" className="aspect-square w-full object-cover transition duration-500 group-hover:scale-[1.03]" />
                  <figcaption className="p-2 text-xs font-bold text-purple-900/80">
                    <span className="text-pink-600">{ph.author}</span>
                    {ph.caption ? ` · ${ph.caption}` : ""}
                  </figcaption>
                  <button
                    type="button"
                    onClick={() => removePhoto(ph.id)}
                    className="absolute right-2 top-2 rounded-full bg-black/45 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-white opacity-0 transition group-hover:opacity-100"
                  >
                    Remove
                  </button>
                </figure>
              ))}
            </div>
          )}
        </Section>

        <Section title="Feelings" subtitle="Short notes, long hugs.">
          <form onSubmit={addFeeling} className="mb-4 flex flex-col gap-2 sm:flex-row">
            <input
              value={feelText}
              onChange={(e) => setFeelText(e.target.value)}
              className="flex-1 rounded-2xl border border-white/60 bg-white/80 px-4 py-3 font-semibold text-purple-950 shadow-inner outline-none ring-2 ring-transparent focus:ring-pink-300"
              placeholder="Something you’re grateful for, something sweet…"
            />
            <button
              type="submit"
              disabled={busy}
              className="rounded-2xl bg-violet-500 px-5 py-3 text-sm font-extrabold text-white shadow-md hover:brightness-105 disabled:opacity-50"
            >
              Share
            </button>
          </form>
          <ul className="space-y-3">
            {feelings.map((f) => (
              <li key={f.id} className="rounded-2xl bg-white/70 px-4 py-3 text-sm font-semibold text-purple-950 shadow-sm ring-1 ring-pink-100/80">
                <span className="text-pink-600">{f.author}:</span> {f.content}
                <div className="mt-1 text-xs font-bold uppercase tracking-wide text-purple-900/40">
                  {format(new Date(f.createdAt), "MMM d, yyyy · h:mm a")}
                </div>
              </li>
            ))}
            {feelings.length === 0 ? <Empty hint="Leave the first little note." /> : null}
          </ul>
        </Section>

        <Section title="Bucket list" subtitle="Adventures for two.">
          <form onSubmit={addBucket} className="mb-4 flex flex-col gap-2 sm:flex-row">
            <input
              value={bucketText}
              onChange={(e) => setBucketText(e.target.value)}
              className="flex-1 rounded-2xl border border-white/60 bg-white/80 px-4 py-3 font-semibold text-purple-950 shadow-inner outline-none ring-2 ring-transparent focus:ring-pink-300"
              placeholder="Stargazing picnic, tiny road trip…"
            />
            <button
              type="submit"
              disabled={busy}
              className="rounded-2xl bg-pink-500 px-5 py-3 text-sm font-extrabold text-white shadow-md hover:brightness-105 disabled:opacity-50"
            >
              Add
            </button>
          </form>
          <ul className="space-y-2">
            {bucket.map((b) => (
              <li
                key={b.id}
                className="flex items-start gap-3 rounded-2xl bg-white/70 px-3 py-2 shadow-sm ring-1 ring-violet-100/80"
              >
                <button
                  type="button"
                  aria-label={b.done ? "Mark not done" : "Mark done"}
                  onClick={() => toggleBucket(b.id, b.done)}
                  className={`mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border-2 text-sm font-extrabold ${
                    b.done ? "border-emerald-400 bg-emerald-100 text-emerald-700" : "border-purple-200 bg-white text-purple-300"
                  }`}
                >
                  {b.done ? "✓" : ""}
                </button>
                <div className="min-w-0 flex-1">
                  <p className={`font-bold text-purple-950 ${b.done ? "text-purple-900/45 line-through" : ""}`}>{b.text}</p>
                  <p className="text-xs font-bold text-purple-900/40">
                    {b.author} · added {format(new Date(b.createdAt), "MMM d, yyyy")}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => removeBucket(b.id)}
                  className="text-xs font-extrabold uppercase tracking-wide text-rose-500 hover:text-rose-600"
                >
                  ✕
                </button>
              </li>
            ))}
            {bucket.length === 0 ? <Empty hint="Dream something together." /> : null}
          </ul>
        </Section>

        <Section title="Special dates" subtitle="Anniversaries, firsts, silly milestones.">
          <form onSubmit={addDate} className="mb-4 grid gap-3 sm:grid-cols-2">
            <input
              value={dateTitle}
              onChange={(e) => setDateTitle(e.target.value)}
              className="rounded-2xl border border-white/60 bg-white/80 px-4 py-3 font-semibold text-purple-950 shadow-inner outline-none ring-2 ring-transparent focus:ring-pink-300"
              placeholder="Title"
            />
            <input
              type="date"
              value={dateValue}
              onChange={(e) => setDateValue(e.target.value)}
              className="rounded-2xl border border-white/60 bg-white/80 px-4 py-3 font-semibold text-purple-950 shadow-inner outline-none ring-2 ring-transparent focus:ring-pink-300"
            />
            <input
              value={dateNote}
              onChange={(e) => setDateNote(e.target.value)}
              className="sm:col-span-2 rounded-2xl border border-white/60 bg-white/80 px-4 py-3 font-semibold text-purple-950 shadow-inner outline-none ring-2 ring-transparent focus:ring-pink-300"
              placeholder="Optional note"
            />
            <button
              type="submit"
              disabled={busy}
              className="sm:col-span-2 rounded-2xl bg-gradient-to-r from-violet-500 to-fuchsia-500 py-3 text-sm font-extrabold text-white shadow-md hover:brightness-105 disabled:opacity-50"
            >
              Save this date
            </button>
          </form>
          <ul className="space-y-2">
            {dates.map((d) => (
              <li
                key={d.id}
                className="flex items-start justify-between gap-3 rounded-2xl bg-white/70 px-4 py-3 shadow-sm ring-1 ring-pink-100/80"
              >
                <div>
                  <p className="font-extrabold text-purple-950">{d.title}</p>
                  <p className="text-sm font-bold text-purple-900/60">{format(new Date(d.date), "MMMM d, yyyy")}</p>
                  {d.note ? <p className="mt-1 text-sm font-semibold text-purple-900/75">{d.note}</p> : null}
                </div>
                <button
                  type="button"
                  onClick={() => removeDate(d.id)}
                  className="text-xs font-extrabold uppercase tracking-wide text-rose-500"
                >
                  ✕
                </button>
              </li>
            ))}
            {dates.length === 0 ? <Empty hint="Add a date that makes you both smile." /> : null}
          </ul>
        </Section>

        <Section
          title="Miss-you messages"
          subtitle="Tiny lines that can appear in the miss-you moment (plus built-in cute ones)."
          className="lg:col-span-2"
        >
          <form onSubmit={addMiss} className="mb-4 flex flex-col gap-2 sm:flex-row">
            <input
              value={missText}
              onChange={(e) => setMissText(e.target.value)}
              className="flex-1 rounded-2xl border border-white/60 bg-white/80 px-4 py-3 font-semibold text-purple-950 shadow-inner outline-none ring-2 ring-transparent focus:ring-pink-300"
              placeholder="Write something that would make them melt…"
            />
            <button
              type="submit"
              disabled={busy}
              className="rounded-2xl bg-rose-500 px-5 py-3 text-sm font-extrabold text-white shadow-md hover:brightness-105 disabled:opacity-50"
            >
              Save line
            </button>
          </form>
          <div className="grid gap-3 sm:grid-cols-2">
            {missMsgs.map((m) => (
              <div
                key={m.id}
                className="flex items-start justify-between gap-2 rounded-2xl bg-white/70 px-4 py-3 text-sm font-semibold text-purple-950 shadow-sm ring-1 ring-violet-100/80"
              >
                <p>
                  <span className="font-extrabold text-pink-600">{m.author}:</span> {m.text}
                </p>
                <button type="button" onClick={() => removeMiss(m.id)} className="text-rose-500">
                  ✕
                </button>
              </div>
            ))}
            {missMsgs.length === 0 ? <Empty hint="Your custom lines will rotate with the built-in sweet messages." /> : null}
          </div>
        </Section>
      </div>

      <footer className="mt-14 text-center text-xs font-bold uppercase tracking-[0.2em] text-purple-900/35">
        Made with love · Arjun & Soumya
      </footer>
    </div>
  );
}

function Section({
  title,
  subtitle,
  children,
  className = "",
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.section
      className={`glass rounded-[2rem] p-6 shadow-lg sm:p-8 ${className}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <h2 className="text-2xl font-extrabold text-purple-950">{title}</h2>
      <p className="mb-4 text-sm font-semibold text-purple-900/65">{subtitle}</p>
      {children}
    </motion.section>
  );
}

function Empty({ hint }: { hint: string }) {
  return <p className="rounded-2xl bg-white/50 px-4 py-6 text-center text-sm font-semibold text-purple-900/55 ring-1 ring-dashed ring-pink-200/80">{hint}</p>;
}
