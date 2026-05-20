import type { MoodTag, Movie } from "@/types";
import { MOVIES_PER_BATCH } from "@/lib/constants";
import {
  discoverMovies,
  fetchMovieDetails,
  fetchPopularPool,
  isTmdbConfigured,
} from "./client";
import { buildDiscoverTiers } from "./discover-params";
import { tmdbResultToMovie } from "./to-movie";
import type { TmdbMovieResult } from "./types";

function shuffle<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function isValidCandidate(movie: TmdbMovieResult): boolean {
  return Boolean(
    movie.poster_path &&
      movie.overview?.trim() &&
      movie.title?.trim() &&
      movie.vote_count >= 20,
  );
}

async function enrichMovie(
  result: TmdbMovieResult,
  tags: MoodTag[],
): Promise<Movie | null> {
  const details = await fetchMovieDetails(result.id);
  return tmdbResultToMovie(result, details, tags);
}

export async function fetchMoviesFromTmdb(
  selectedTags: MoodTag[],
  count: number,
  excludeIds: string[],
): Promise<Movie[]> {
  if (!isTmdbConfigured()) return [];

  const exclude = new Set(excludeIds);
  const tiers = buildDiscoverTiers(selectedTags);
  const pool: TmdbMovieResult[] = [];
  const seenTmdb = new Set<number>();

  const targetPool = Math.max(count * 8, 40);

  for (const tier of tiers) {
    for (let attempt = 0; attempt < 10 && pool.length < targetPool; attempt++) {
      const page = Math.floor(Math.random() * 20) + 1;
      try {
        const results = await discoverMovies(tier, page);
        for (const movie of results) {
          if (!isValidCandidate(movie)) continue;
          if (seenTmdb.has(movie.id)) continue;
          if (exclude.has(`tmdb-${movie.id}`)) continue;
          seenTmdb.add(movie.id);
          pool.push(movie);
        }
      } catch {
        continue;
      }
    }
    if (pool.length >= targetPool) break;
  }

  if (pool.length < count) {
    for (let page = 1; page <= 15 && pool.length < targetPool; page++) {
      try {
        const popular = await fetchPopularPool(page);
        for (const movie of popular) {
          if (!isValidCandidate(movie)) continue;
          if (seenTmdb.has(movie.id)) continue;
          if (exclude.has(`tmdb-${movie.id}`)) continue;
          seenTmdb.add(movie.id);
          pool.push(movie);
        }
      } catch {
        break;
      }
    }
  }

  const shuffled = shuffle(pool);
  const movies: Movie[] = [];

  for (const result of shuffled) {
    if (movies.length >= count) break;
    const movie = await enrichMovie(result, selectedTags);
    if (movie) movies.push(movie);
  }

  return movies;
}

export { isTmdbConfigured };
