import type { Movie } from "@/types";

const TMDB_BASE = "https://image.tmdb.org/t/p/w342";

export function getPosterSrc(movie: Movie): string {
  if (movie.posterPath.startsWith("http")) {
    return movie.posterPath;
  }
  if (movie.posterPath.startsWith("/posters/")) {
    return movie.posterPath;
  }
  return `${TMDB_BASE}${movie.posterPath}`;
}
