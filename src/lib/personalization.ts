import type { CoupleName } from "./session";

export function partnerOf(viewer: CoupleName): CoupleName {
  return viewer === "Arjun" ? "Soumya" : "Arjun";
}

export function personalizedHomeSubtitle(viewer: CoupleName) {
  const p = partnerOf(viewer);
  return `This whole page is yours right now — ${p}’s love is tucked into every corner.`;
}

export function personalizedMissCta(viewer: CoupleName) {
  const p = partnerOf(viewer);
  return `A little show just for you — photos you’ve shared and words ${p} would want you to feel.`;
}

export function personalizedMissButton() {
  return "Open your miss-you moment 💌";
}

export function feelingsPlaceholder(viewer: CoupleName) {
  const p = partnerOf(viewer);
  return `Something sweet about ${p}, or something you’re feeling right now…`;
}

export function missMsgPlaceholder(viewer: CoupleName) {
  const p = partnerOf(viewer);
  return `A line for ${p} to find next time they tap “miss-you”…`;
}

export function photoWallSubtitle(partner: CoupleName) {
  return `Little squares of joy — ${partner} will smile when they see these.`;
}
