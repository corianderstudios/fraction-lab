import { useSyncExternalStore } from "react";

// Hash routing (#/learn/add) means the app works on any static host with zero
// server rewrite rules — GitHub Pages, Netlify, S3, a USB stick, anything.

export const LESSON_IDS = ["basics", "add", "subtract", "multiply", "divide"];
export const GAME_OPS = ["add", "subtract", "multiply", "divide"];

const subscribe = (callback) => {
  window.addEventListener("hashchange", callback);
  return () => window.removeEventListener("hashchange", callback);
};
const getSnapshot = () => window.location.hash.replace(/^#/, "") || "/";
const getServerSnapshot = () => "/";

export function useHashRoute() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/** The URL is user-controlled input too, so only known routes are ever accepted. */
export function parseRoute(rawPath) {
  const path = String(rawPath ?? "")
    .slice(0, 100)
    .toLowerCase()
    .replace(/[^a-z/]/g, "");
  const parts = path.split("/").filter(Boolean);

  if (parts.length === 0) return { name: "home" };
  if (
    parts[0] === "learn" &&
    parts.length === 2 &&
    LESSON_IDS.includes(parts[1])
  ) {
    return { name: "lesson", id: parts[1] };
  }
  if (parts[0] === "games" && parts.length === 1) return { name: "games" };
  if (
    parts[0] === "games" &&
    parts.length === 2 &&
    GAME_OPS.includes(parts[1])
  ) {
    return { name: "game", op: parts[1] };
  }
  if (parts[0] === "glossary" && parts.length === 1)
    return { name: "glossary" };
  return { name: "notfound" };
}

/** Which top-level section a route belongs to (for nav highlighting and progress). */
export function sectionIdForRoute(route) {
  if (route.name === "lesson") return route.id;
  if (route.name === "games" || route.name === "game") return "games";
  if (route.name === "glossery") return "glossery";
  return null;
}
