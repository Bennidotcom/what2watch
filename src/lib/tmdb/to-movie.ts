import type { Movie, MoodTag } from "@/types";
import type { TmdbMovieDetails, TmdbMovieResult } from "./types";

export function tmdbId(movieId: string): number | null {
  if (!movieId.startsWith("tmdb-")) return null;
  const n = Number(movieId.slice(5));
  return Number.isFinite(n) ? n : null;
}

export function toMovieId(tmdbNumericId: number): string {
  return `tmdb-${tmdbNumericId}`;
}

export function tmdbResultToMovie(
  result: TmdbMovieResult,
  details: TmdbMovieDetails | null,
  tags: MoodTag[],
): Movie | null {
  const poster = result.poster_path ?? details?.poster_path;
  if (!poster || !result.overview?.trim()) return null;

  const year = result.release_date
    ? Number.parseInt(result.release_date.slice(0, 4), 10)
    : 0;

  const cast =
    details?.credits?.cast
      ?.sort((a, b) => a.order - b.order)
      .slice(0, 3)
      .map((c) => c.name) ?? [];

  const director =
    details?.credits?.crew?.find((c) => c.job === "Director")?.name ?? "—";

  const writer =
    details?.credits?.crew?.find(
      (c) => c.job === "Screenplay" || c.job === "Writer",
    )?.name ?? director;

  return {
    id: toMovieId(result.id),
    title: result.title,
    year: Number.isFinite(year) ? year : 2000,
    posterPath: poster,
    description: result.overview,
    cast: cast.length > 0 ? cast : ["—"],
    director,
    writer,
    tags,
  };
}
