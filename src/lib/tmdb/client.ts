import type {
  TmdbDiscoverResponse,
  TmdbMovieDetails,
  TmdbMovieResult,
} from "./types";
import type { DiscoverParams } from "./discover-params";

const TMDB_API = "https://api.themoviedb.org/3";

function getApiKey(): string | undefined {
  return process.env.TMDB_API_KEY?.trim();
}

export function isTmdbConfigured(): boolean {
  return Boolean(getApiKey());
}

function buildUrl(path: string, params: Record<string, string>): string {
  const key = getApiKey();
  if (!key) throw new Error("TMDB_API_KEY is not configured");

  const search = new URLSearchParams({
    api_key: key,
    language: "en-US",
    include_adult: "false",
    ...params,
  });

  return `${TMDB_API}${path}?${search.toString()}`;
}

export async function discoverMovies(
  discover: DiscoverParams,
  page: number,
): Promise<TmdbMovieResult[]> {
  const params: Record<string, string> = {
    sort_by: "popularity.desc",
    vote_count_gte: "80",
    page: String(page),
  };

  if (discover.with_genres) params.with_genres = discover.with_genres;
  if (discover.primary_release_date_gte) {
    params["primary_release_date.gte"] = discover.primary_release_date_gte;
  }
  if (discover.primary_release_date_lte) {
    params["primary_release_date.lte"] = discover.primary_release_date_lte;
  }
  if (discover.certification_country) {
    params.certification_country = discover.certification_country;
  }
  if (discover.certification_lte) {
    params.certification_lte = discover.certification_lte;
  }

  const url = buildUrl("/discover/movie", params);
  const res = await fetch(url, { next: { revalidate: 3600 } });

  if (!res.ok) {
    throw new Error(`TMDB discover failed: ${res.status}`);
  }

  const data = (await res.json()) as TmdbDiscoverResponse;
  return data.results ?? [];
}

export async function fetchMovieDetails(
  tmdbId: number,
): Promise<TmdbMovieDetails | null> {
  const url = buildUrl(`/movie/${tmdbId}`, {
    append_to_response: "credits",
  });

  const res = await fetch(url, { next: { revalidate: 86400 } });
  if (!res.ok) return null;

  return (await res.json()) as TmdbMovieDetails;
}

export async function fetchPopularPool(page: number): Promise<TmdbMovieResult[]> {
  const url = buildUrl("/movie/popular", {
    page: String(page),
  });

  const res = await fetch(url, { next: { revalidate: 3600 } });
  if (!res.ok) return [];

  const data = (await res.json()) as TmdbDiscoverResponse;
  return data.results ?? [];
}
