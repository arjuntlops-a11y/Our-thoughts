"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const names = ["Arjun", "Soumya"] as const;

export function LoginClient() {
  const router = useRouter();
  const [name, setName] = useState<(typeof names)[number]>("Arjun");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me", { credentials: "include" })
      .then((r) => r.json())
      .then((d) => {
        if (d.user) router.replace("/home");
      })
      .catch(() => {});
  }, [router]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setBusy(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErr(data.error ?? "Something went sideways.");
        return;
      }
      router.push("/home");
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-16">
      <motion.div
        className="w-full max-w-md glass rounded-[2rem] p-8 shadow-2xl"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
      >
        <div className="mb-6 text-center">
          <p className="text-sm font-extrabold uppercase tracking-[0.25em] text-pink-500">Welcome home</p>
          <h1 className="mt-2 text-3xl font-extrabold text-purple-950 sm:text-4xl">Arjun & Soumya</h1>
          <p className="mt-2 text-base font-semibold text-purple-900/70">
            Your cozy corner for photos, feelings, and little dreams.
          </p>
          <p className="mt-2 rounded-2xl bg-pink-100/60 px-3 py-2 text-sm font-bold text-pink-800/90">
            {name === "Arjun"
              ? "We’ll tailor the whole vibe for you — Soumya’s love notes, your weather, your miss-you moment."
              : "We’ll tailor the whole vibe for you — Arjun’s love notes, your weather, your miss-you moment."}
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-bold text-purple-900/80">Who&apos;s here?</label>
            <div className="grid grid-cols-2 gap-2">
              {names.map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setName(n)}
                  className={`rounded-2xl px-4 py-3 text-sm font-extrabold shadow-sm ring-2 transition ${
                    name === n
                      ? "bg-gradient-to-br from-pink-400 to-fuchsia-500 text-white ring-pink-300"
                      : "bg-white/70 text-purple-900 ring-transparent hover:ring-pink-200"
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="secret" className="mb-1 block text-sm font-bold text-purple-900/80">
              Shared secret
            </label>
            <input
              id="secret"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-2xl border border-white/60 bg-white/80 px-4 py-3 text-purple-950 shadow-inner outline-none ring-2 ring-transparent transition focus:ring-pink-300"
              placeholder="Only you two know this"
            />
          </div>

          {err ? <p className="text-sm font-semibold text-rose-600">{err}</p> : null}

          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-violet-500 py-3.5 text-lg font-extrabold text-white shadow-lg shadow-pink-300/40 transition hover:brightness-105 disabled:opacity-60"
          >
            {busy ? "Opening…" : "Step inside"}
          </button>
        </form>

        <p className="mt-5 text-center text-xs font-semibold text-purple-900/45">
          Tip: set <code className="rounded bg-white/60 px-1">COUPLE_SECRET</code> in <code className="rounded bg-white/60 px-1">.env</code> on the server.
        </p>
      </motion.div>
    </div>
  );
}
