const STORAGE_KEY = "what2watch-recent-ids";
const MAX_STORED = 20;

export function getRecentMovieIds(): string[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed)
      ? parsed.filter((id): id is string => typeof id === "string")
      : [];
  } catch {
    return [];
  }
}

export function rememberMovieIds(ids: string[]): void {
  if (typeof window === "undefined" || ids.length === 0) return;

  const merged = [...new Set([...ids, ...getRecentMovieIds()])].slice(
    0,
    MAX_STORED,
  );
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
}

export function clearRecentMovieIds(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(STORAGE_KEY);
}
