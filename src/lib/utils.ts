import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/['.]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function normalizeName(value: string) {
  return value
    .toLowerCase()
    .replace(/[.'']/g, "")
    .replace(/\b(jr|sr|iii|ii|iv)\b/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export function clamp(n: number, min = 0, max = 100) {
  return Math.min(max, Math.max(min, n));
}

export function round1(n: number) {
  return Math.round(n * 10) / 10;
}

export function round0(n: number) {
  return Math.round(n);
}
