"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { WeatherKind } from "./WeatherDecor";

const TIPS: Record<WeatherKind, { line: string; accessory: string }> = {
  rain: { line: "Purrfect weather to text your person a cozy voice note.", accessory: "☂️" },
  summer: { line: "Sun’s out — send them a sunny selfie.", accessory: "🕶️" },
  winter: { line: "Cold hands, warm heart — maybe plan a hot-chocolate date.", accessory: "🧣" },
  autumn: { line: "Leaf piles and love notes. Classic combo.", accessory: "🍁" },
};

export function CatCompanion({ weather, partnerName }: { weather: WeatherKind; partnerName: string }) {
  const [open, setOpen] = useState(false);
  const tip = TIPS[weather];

  return (
    <div className="pointer-events-auto fixed bottom-4 left-4 z-30 sm:bottom-6 sm:left-6">
      <motion.button
        type="button"
        onClick={() => setOpen(!open)}
        className="relative flex items-end gap-1 rounded-3xl bg-white/85 px-3 py-2 shadow-lg ring-2 ring-pink-200/80 backdrop-blur-sm transition hover:ring-pink-400"
        aria-label="Cute cat friend"
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.97 }}
      >
        <span className="text-4xl leading-none sm:text-5xl" role="img">
          🐱
        </span>
        <span className="text-xl">{tip.accessory}</span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            className="absolute bottom-full left-0 mb-2 max-w-[min(100vw-2rem,280px)] rounded-2xl bg-white/95 px-4 py-3 text-sm font-bold text-purple-900 shadow-xl ring-2 ring-violet-200/80"
          >
            <p className="text-xs font-extrabold uppercase tracking-wide text-pink-500">Whiskers says</p>
            <p className="mt-1 leading-snug">{tip.line}</p>
            <p className="mt-2 text-xs font-semibold text-purple-900/60">Psst — {partnerName} is your favorite human, right?</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
