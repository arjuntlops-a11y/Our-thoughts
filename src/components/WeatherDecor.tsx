"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export type WeatherKind = "rain" | "summer" | "winter" | "autumn";

export const WEATHER_OPTIONS: { id: WeatherKind; label: string; emoji: string }[] = [
  { id: "rain", label: "Cozy rain", emoji: "🌧️" },
  { id: "summer", label: "Sunny summer", emoji: "☀️" },
  { id: "winter", label: "Snowy winter", emoji: "❄️" },
  { id: "autumn", label: "Autumn leaves", emoji: "🍂" },
];

function pickRandom<T>(arr: T[]) {
  return arr[Math.floor(Math.random() * arr.length)]!;
}

export function useWeatherVibe() {
  const ids = WEATHER_OPTIONS.map((w) => w.id);
  const [weather, setWeather] = useState<WeatherKind>(() => pickRandom(ids));

  const shuffle = () => setWeather(pickRandom(ids));

  return { weather, setWeather, shuffle, options: WEATHER_OPTIONS };
}

function Rain() {
  const drops = useMemo(
    () =>
      Array.from({ length: 48 }, (_, i) => ({
        id: i,
        left: `${(i * 7.3) % 100}%`,
        delay: `${(i % 12) * 0.08}s`,
        dur: `${0.55 + (i % 5) * 0.12}s`,
      })),
    [],
  );
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
      {drops.map((d) => (
        <span
          key={d.id}
          className="rain-line absolute top-0 h-10 w-[2px] rounded-full bg-sky-400/55"
          style={{ left: d.left, animationDuration: d.dur, animationDelay: d.delay }}
        />
      ))}
    </div>
  );
}

function Snow() {
  const flakes = useMemo(
    () =>
      Array.from({ length: 40 }, (_, i) => ({
        id: i,
        left: `${(i * 11) % 100}%`,
        delay: `${(i % 15) * 0.15}s`,
        size: 4 + (i % 5),
        dur: `${4 + (i % 6)}s`,
      })),
    [],
  );
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
      {flakes.map((f) => (
        <span
          key={f.id}
          className="snow-flake absolute top-0 rounded-full bg-white/85 shadow-sm"
          style={{
            left: f.left,
            width: f.size,
            height: f.size,
            animationDuration: f.dur,
            animationDelay: f.delay,
          }}
        />
      ))}
    </div>
  );
}

function Leaves() {
  const leaves = useMemo(
    () =>
      Array.from({ length: 28 }, (_, i) => ({
        id: i,
        left: `${(i * 13) % 100}%`,
        delay: `${(i % 10) * 0.2}s`,
        emoji: ["🍂", "🍁", "🌰"][i % 3],
        dur: `${5 + (i % 5)}s`,
      })),
    [],
  );
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden text-lg" aria-hidden>
      {leaves.map((l) => (
        <span
          key={l.id}
          className="leaf-drop absolute top-0 opacity-90"
          style={{
            left: l.left,
            animationDuration: l.dur,
            animationDelay: l.delay,
          }}
        >
          {l.emoji}
        </span>
      ))}
    </div>
  );
}

function SummerSparkles() {
  const bits = useMemo(
    () =>
      Array.from({ length: 22 }, (_, i) => ({
        id: i,
        left: `${(i * 17) % 100}%`,
        top: `${(i * 23) % 85}%`,
        delay: `${(i % 8) * 0.25}s`,
      })),
    [],
  );
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden text-xl" aria-hidden>
      {bits.map((b) => (
        <motion.span
          key={b.id}
          className="absolute"
          style={{ left: b.left, top: b.top }}
          animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.15, 0.8] }}
          transition={{ duration: 2.2 + (b.id % 4) * 0.2, repeat: Infinity, delay: parseFloat(b.delay) }}
        >
          {["✨", "💛", "🌻", "☀️"][b.id % 4]}
        </motion.span>
      ))}
    </div>
  );
}

export function WeatherParticles({ weather }: { weather: WeatherKind }) {
  return (
    <AnimatePresence mode="wait">
      {weather === "rain" && (
        <motion.div key="rain" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <Rain />
        </motion.div>
      )}
      {weather === "winter" && (
        <motion.div key="winter" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <Snow />
        </motion.div>
      )}
      {weather === "autumn" && (
        <motion.div key="autumn" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <Leaves />
        </motion.div>
      )}
      {weather === "summer" && (
        <motion.div key="summer" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <SummerSparkles />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function WeatherSwitcher({
  weather,
  options,
  onSelect,
  onShuffle,
}: {
  weather: WeatherKind;
  options: typeof WEATHER_OPTIONS;
  onSelect: (w: WeatherKind) => void;
  onShuffle: () => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs font-extrabold uppercase tracking-widest text-purple-900/45">Sky today</span>
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          onClick={() => onSelect(o.id)}
          className={`rounded-full px-3 py-1.5 text-xs font-extrabold shadow-sm ring-2 transition ${
            weather === o.id
              ? "bg-white/90 text-purple-900 ring-pink-400"
              : "bg-white/50 text-purple-900/70 ring-transparent hover:bg-white/75"
          }`}
        >
          {o.emoji} {o.label}
        </button>
      ))}
      <button
        type="button"
        onClick={onShuffle}
        className="rounded-full bg-gradient-to-r from-pink-400 to-violet-400 px-3 py-1.5 text-xs font-extrabold text-white shadow-md hover:brightness-105"
      >
        Surprise me ✨
      </button>
    </div>
  );
}
