import { MOVIES } from "@/data/movies";
import { MOVIES_PER_BATCH } from "@/lib/constants";
import { recommendMovies } from "@/lib/recommend";
import { fetchMoviesFromTmdb, isTmdbConfigured } from "@/lib/tmdb/fetch-recommendations";
import type { MoodTag, Movie } from "@/types";

export type RecommendSource = "tmdb" | "local" | "mixed";

export type RecommendResult = {
  movies: Movie[];
  source: RecommendSource;
  tmdbEnabled: boolean;
};

/** Always returns exactly `count` movies when the catalog or TMDB can supply them. */
export async function recommendMoviesForUser(
  selectedTags: MoodTag[],
  count: number = MOVIES_PER_BATCH,
  excludeIds: string[] = [],
): Promise<RecommendResult> {
  const exclude = [...excludeIds];
  let movies: Movie[] = [];
  let source: RecommendSource = "local";

  if (isTmdbConfigured()) {
    movies = await fetchMoviesFromTmdb(selectedTags, count, exclude);
    if (movies.length > 0) source = "tmdb";
  }

  if (movies.length < count) {
    const local = recommendMovies(selectedTags, {
      count: count - movies.length,
      excludeIds: [...exclude, ...movies.map((m) => m.id)],
    });
    movies = [...movies, ...local];
    source = movies.length > 0 && local.length > 0 ? "mixed" : source;
  }

  if (movies.length < count) {
    const any = recommendMovies(selectedTags, {
      count: count - movies.length,
      excludeIds: movies.map((m) => m.id),
    });
    movies = [...movies, ...any];
  }

  while (movies.length < count) {
    const used = new Set([...exclude, ...movies.map((m) => m.id)]);
    const filler = MOVIES.filter((m) => !used.has(m.id))
      .sort(() => Math.random() - 0.5)
      .slice(0, count - movies.length);
    if (filler.length === 0) break;
    movies = [...movies, ...filler];
    if (filler.length > 0 && source === "tmdb") source = "mixed";
  }

  return {
    movies: movies.slice(0, count),
    source: movies.length && isTmdbConfigured() ? source : "local",
    tmdbEnabled: isTmdbConfigured(),
  };
}

export function canFetchMoreMovies(
  currentCount: number,
  maxResults: number,
): boolean {
  return currentCount < maxResults;
}
