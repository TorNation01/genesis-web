const R_GENRES = new Set([
  "Horror",
  "Lovecraftian",
  "Zombie Apocalypse",
  "Cosmic Horror",
  "Military & War",
  "Biopunk",
  "Weird West",
  "Gothic Romance",
]);

const PG13_GENRES = new Set([
  "Cyberpunk",
  "Noir / Detective",
  "Post-Apocalyptic",
  "Spy & Espionage",
  "Heist & Crime",
  "Survival",
  "Dieselpunk",
  "Supernatural / Paranormal",
  "Political Intrigue",
]);

const G_GENRES = new Set(["Cozy Mystery", "Solarpunk", "Isekai / Portal Fantasy"]);

export function computeContentRating(primary, period, mashOn, secondary) {
  void period;
  if (!primary) return null;
  if (R_GENRES.has(primary) || (mashOn && secondary && R_GENRES.has(secondary))) return "R";
  if (PG13_GENRES.has(primary) || (mashOn && secondary && PG13_GENRES.has(secondary)))
    return "PG-13";
  if (G_GENRES.has(primary) && (!mashOn || (secondary && G_GENRES.has(secondary)))) return "G";
  return "PG";
}

export function ratingNeedsWarning(rating) {
  return rating === "R" || rating === "NC-17";
}

export const RATING_CONFIG = {
  G: {
    label: "G",
    color: "#1A6B2A",
    bg: "rgba(26,107,42,0.12)",
    desc: "General Audiences",
  },
  PG: {
    label: "PG",
    color: "#1A4A8B",
    bg: "rgba(26,74,139,0.12)",
    desc: "Parental Guidance",
  },
  "PG-13": {
    label: "PG-13",
    color: "#8B6A0E",
    bg: "rgba(139,106,14,0.12)",
    desc: "Teens and Above",
  },
  R: {
    label: "R",
    color: "#8B2020",
    bg: "rgba(139,32,32,0.15)",
    desc: "Mature Audiences",
  },
};
