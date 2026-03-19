import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth-server";
import type { CoupleName } from "@/lib/session";

/** Shown when Arjun is logged in — words Soumya might want him to feel */
const DEFAULT_FOR_ARJUN = [
  "Arjun — Soumya’s heart does that little drumroll every time she thinks of you.",
  "Hey love — you’re her favorite notification, her favorite voice, her favorite everything.",
  "Distance is boring. You’re not. — xo, the universe (and Soumya)",
  "She’d trade her last piece of chocolate for five more minutes with you. Probably.",
  "Arjun, you’re the plot twist Soumya never saw coming — and never wants to end.",
  "If missing you was a sport, she’d have a trophy shelf by now.",
  "Soumya saves the softest part of her day for thoughts of you.",
  "You make ordinary Tuesdays feel like a tiny festival, Arjun.",
  "She’s proud of you — even on the messy, human, sleepy days.",
  "Arjun, you’re home-shaped in her mind. Always.",
];

/** Shown when Soumya is logged in — words Arjun might want her to feel */
const DEFAULT_FOR_SOUMYA = [
  "Soumya — Arjun’s world gets warmer when you’re in it. Fact, not poetry.",
  "Hey star — he talks about you like you invented sunlight.",
  "You’re his soft place to land, his loudest cheerleader, his calmest storm.",
  "Soumya, every song makes him think of dancing with you — even the weird ones.",
  "He’d build a playlist called “her” and it’d only have your laugh on repeat.",
  "Arjun is saving his best stories for the next time he sees you.",
  "You’re not “too much” — you’re the right amount of magic.",
  "Soumya, he’s grateful for you in ways he’ll spend a lifetime showing.",
  "Missing you is his heart’s favorite hobby — signed, team Arjun.",
  "You’re the cozy plot twist he never saw coming, Soumya — and never wants to end.",
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const viewer = session.name as CoupleName;
  const partner: CoupleName = viewer === "Arjun" ? "Soumya" : "Arjun";

  const [photos, custom] = await Promise.all([
    prisma.photo.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.missMessage.findMany(),
  ]);

  const photoUrls = photos.map((p) => ({ id: p.id, url: p.url, caption: p.caption }));

  const fromPartner = custom.filter((m) => m.author === partner);
  const fromSelf = custom.filter((m) => m.author === viewer);

  const tailoredDefaults = viewer === "Arjun" ? DEFAULT_FOR_ARJUN : DEFAULT_FOR_SOUMYA;

  const messages = [...fromPartner.map((m) => m.text), ...tailoredDefaults, ...fromSelf.map((m) => m.text)];

  return NextResponse.json({
    viewer,
    partner,
    photos: shuffle(photoUrls).slice(0, 12),
    messages: shuffle(messages).slice(0, 14),
  });
}
