"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

type SlidePhoto = { id: string; url: string; caption: string | null };

type Props = {
  open: boolean;
  onClose: () => void;
};

export function MissYouModal({ open, onClose }: Props) {
  const [loading, setLoading] = useState(true);
  const [photos, setPhotos] = useState<SlidePhoto[]>([]);
  const [messages, setMessages] = useState<string[]>([]);
  const [idx, setIdx] = useState(0);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/miss-you");
      if (!res.ok) throw new Error("nope");
      const data = await res.json();
      setPhotos(data.photos ?? []);
      setMessages(data.messages ?? []);
    } catch {
      setPhotos([]);
      setMessages([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    load();
    setIdx(0);
  }, [open, load]);

  useEffect(() => {
    if (!open || loading) return;
    const t = window.setInterval(() => {
      setIdx((i) => i + 1);
    }, 4200);
    return () => window.clearInterval(t);
  }, [open, loading, photos.length, messages.length]);

  const message = messages.length ? messages[idx % messages.length] : "You two are loved more than Wi‑Fi at midnight.";
  const photo = photos.length ? photos[idx % photos.length] : null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal
          aria-label="Missing you moment"
        >
          <button
            type="button"
            className="absolute inset-0 cursor-default bg-black/35 backdrop-blur-[2px]"
            aria-label="Close overlay"
            onClick={onClose}
          />
          <motion.div
            className="relative z-10 w-full max-w-lg overflow-hidden rounded-[2rem] glass shadow-2xl"
            initial={{ scale: 0.92, y: 24, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
          >
            <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-pink-300/40 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-12 -left-10 h-40 w-40 rounded-full bg-violet-300/40 blur-3xl" />

            <div className="relative p-6 sm:p-8">
              <div className="mb-4 flex items-center justify-between gap-3">
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-pink-600/90">Missing you</p>
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-full bg-white/70 px-3 py-1 text-sm font-semibold text-purple-900 shadow-sm ring-1 ring-pink-200/80 transition hover:bg-white"
                >
                  Close ✕
                </button>
              </div>

              {loading ? (
                <p className="py-16 text-center text-lg font-semibold text-purple-900/70">Gathering hugs…</p>
              ) : (
                <>
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-gradient-to-br from-pink-100 to-violet-100 shadow-inner ring-1 ring-white/80">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={photo?.id ?? "empty"}
                        className="absolute inset-0 flex items-center justify-center"
                        initial={{ opacity: 0, scale: 1.04 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ duration: 0.55 }}
                      >
                        {photo ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={photo.url} alt="" className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex flex-col items-center gap-3 p-8 text-center">
                            <span className="animate-floaty text-6xl">💕</span>
                            <span className="text-lg font-bold text-purple-900/80">Add photos in your gallery — they’ll sparkle here too.</span>
                          </div>
                        )}
                      </motion.div>
                    </AnimatePresence>
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/25 to-transparent" />
                  </div>

                  {photo?.caption ? (
                    <p className="mt-2 text-center text-sm font-semibold text-purple-900/70">{photo.caption}</p>
                  ) : null}

                  <motion.div
                    key={message}
                    className="mt-5 rounded-2xl bg-white/75 px-4 py-4 text-center text-lg font-bold leading-snug text-purple-950 shadow-sm ring-1 ring-pink-100"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35 }}
                  >
                    {message}
                  </motion.div>

                  <p className="mt-4 text-center text-xs font-semibold uppercase tracking-widest text-purple-900/45">
                    Made with extra sparkles · Arjun & Soumya
                  </p>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
