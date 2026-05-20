import type { MoodTag } from "@/types";
import { TMDB_GENRES } from "./genres";

export type DiscoverParams = {
  with_genres?: string;
  primary_release_date_gte?: string;
  primary_release_date_lte?: string;
  certification_country?: string;
  certification_lte?: string;
  without_genres?: string;
};

const ERA_TAGS = ["era-classic", "era-aughts", "era-recent"] as const;

function getEra(selectedTags: MoodTag[]): DiscoverParams {
  const era = ERA_TAGS.find((e) => selectedTags.includes(e));
  switch (era) {
    case "era-classic":
      return { primary_release_date_lte: "1989-12-31" };
    case "era-aughts":
      return {
        primary_release_date_gte: "2000-01-01",
        primary_release_date_lte: "2009-12-31",
      };
    case "era-recent":
      return { primary_release_date_gte: "2010-01-01" };
    default:
      return {};
  }
}

function genreSet(...ids: number[]): string {
  return [...new Set(ids)].join(",");
}

export function buildDiscoverTiers(
  selectedTags: MoodTag[],
): DiscoverParams[] {
  const era = getEra(selectedTags);
  const tiers: DiscoverParams[] = [];

  const genres: number[] = [];

  if (selectedTags.includes("emotion-light")) {
    genres.push(TMDB_GENRES.comedy, TMDB_GENRES.family, TMDB_GENRES.animation);
  }
  if (selectedTags.includes("emotion-thoughtful")) {
    genres.push(TMDB_GENRES.drama, TMDB_GENRES.history, TMDB_GENRES.mystery);
  }
  if (selectedTags.includes("emotion-heavy")) {
    genres.push(TMDB_GENRES.drama, TMDB_GENRES.thriller);
  }

  if (selectedTags.includes("energy-high")) {
    genres.push(TMDB_GENRES.action, TMDB_GENRES.adventure, TMDB_GENRES.thriller);
  }
  if (selectedTags.includes("energy-low")) {
    genres.push(TMDB_GENRES.drama, TMDB_GENRES.romance);
  }

  if (selectedTags.includes("setting-intimate")) {
    genres.push(TMDB_GENRES.drama, TMDB_GENRES.romance, TMDB_GENRES.comedy);
  }
  if (selectedTags.includes("setting-expansive")) {
    genres.push(
      TMDB_GENRES.adventure,
      TMDB_GENRES.action,
      TMDB_GENRES.scifi,
      TMDB_GENRES.fantasy,
    );
  }
  if (selectedTags.includes("setting-surreal")) {
    genres.push(TMDB_GENRES.fantasy, TMDB_GENRES.scifi, TMDB_GENRES.animation);
  }

  if (selectedTags.includes("audience-date")) {
    genres.push(TMDB_GENRES.romance, TMDB_GENRES.comedy);
  }
  if (selectedTags.includes("audience-friends")) {
    genres.push(TMDB_GENRES.comedy, TMDB_GENRES.action);
  }
  if (selectedTags.includes("audience-family")) {
    genres.push(TMDB_GENRES.family, TMDB_GENRES.animation, TMDB_GENRES.comedy);
  }
  if (selectedTags.includes("audience-solo")) {
    genres.push(TMDB_GENRES.drama, TMDB_GENRES.mystery, TMDB_GENRES.thriller);
  }

  const strict: DiscoverParams = {
    ...era,
    ...(genres.length > 0 ? { with_genres: genreSet(...genres) } : {}),
  };

  if (selectedTags.includes("audience-family")) {
    strict.certification_country = "US";
    strict.certification_lte = "PG-13";
  }

  tiers.push(strict);

  tiers.push({
    ...era,
    ...(genres.length > 0
      ? { with_genres: genreSet(...genres.slice(0, 3)) }
      : {}),
  });

  tiers.push({ ...era });

  tiers.push({});

  return tiers;
}
