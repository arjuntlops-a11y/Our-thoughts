"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";

const HEARTS = ["💕", "💗", "💖", "💘", "💝", "✨", "🫶"];

export function FloatingHearts() {
  const items = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => ({
        id: i,
        left: `${5 + ((i * 17) % 90)}%`,
        top: `${8 + ((i * 23) % 75)}%`,
        emoji: HEARTS[i % HEARTS.length],
        delay: i * 0.15,
        dur: 4 + (i % 5),
      })),
    [],
  );

  return (
    <div className="pointer-events-none fixed inset-0 z-[1] overflow-hidden" aria-hidden>
      {items.map((h) => (
        <motion.span
          key={h.id}
          className="absolute text-lg opacity-70 sm:text-xl"
          style={{ left: h.left, top: h.top }}
          animate={{ y: [0, -14, 0], rotate: [-6, 6, -6], opacity: [0.35, 0.95, 0.35] }}
          transition={{
            duration: h.dur,
            repeat: Infinity,
            delay: h.delay,
            ease: "easeInOut",
          }}
        >
          {h.emoji}
        </motion.span>
      ))}
    </div>
  );
}
