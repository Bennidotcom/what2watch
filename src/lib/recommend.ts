import { MOVIES } from "@/data/movies";
import { MAX_MOVIE_RESULTS, MOVIES_PER_BATCH } from "@/lib/constants";
import type { MoodTag, Movie } from "@/types";

const ERA_TAGS = ["era-classic", "era-aughts", "era-recent"] as const;

const MOOD_DIMENSIONS: readonly MoodTag[][] = [
  ["energy-low", "energy-medium", "energy-high"],
  ["emotion-light", "emotion-thoughtful", "emotion-heavy"],
  ["setting-intimate", "setting-expansive", "setting-surreal"],
  ["audience-solo", "audience-date", "audience-friends", "audience-family"],
];

function getSelectedEra(selectedTags: MoodTag[]): MoodTag | null {
  return ERA_TAGS.find((era) => selectedTags.includes(era)) ?? null;
}

export function movieMatchesEra(movie: Movie, era: MoodTag): boolean {
  switch (era) {
    case "era-classic":
      return movie.year < 1990;
    case "era-aughts":
      return movie.year >= 2000 && movie.year <= 2009;
    case "era-recent":
      return movie.year >= 2010;
    default:
      return true;
  }
}

function getMoodSelections(selectedTags: MoodTag[]): MoodTag[] {
  return MOOD_DIMENSIONS.map((dimension) =>
    selectedTags.find((tag) => dimension.includes(tag)),
  ).filter((tag): tag is MoodTag => Boolean(tag));
}

function moodMatchCount(movie: Movie, moodSelections: MoodTag[]): number {
  return moodSelections.filter((tag) => movie.tags.includes(tag)).length;
}

function moodConflictPenalty(movie: Movie, moodSelections: MoodTag[]): number {
  let penalty = 0;

  for (const selected of moodSelections) {
    const dimension = MOOD_DIMENSIONS.find((group) => group.includes(selected));
    if (!dimension) continue;

    const conflicting = dimension.find(
      (tag) => tag !== selected && movie.tags.includes(tag),
    );

    if (conflicting) penalty += 4;
  }

  return penalty;
}

function scoreMovie(movie: Movie, moodSelections: MoodTag[]): number {
  const matches = moodMatchCount(movie, moodSelections);
  const penalty = moodConflictPenalty(movie, moodSelections);
  return matches * 10 - penalty;
}

function minMatchesForBatch(batchIndex: number, totalMood: number): number {
  if (batchIndex <= 0) return Math.max(3, totalMood - 1);
  if (batchIndex <= 2) return Math.min(3, totalMood);
  return Math.min(2, totalMood);
}

function hasMoodConflict(movie: Movie, moodSelections: MoodTag[]): boolean {
  return moodConflictPenalty(movie, moodSelections) > 0;
}

type RankedMovie = {
  movie: Movie;
  matches: number;
  score: number;
  weight: number;
};

function buildRanked(pool: Movie[], moodSelections: MoodTag[]): RankedMovie[] {
  return pool
    .map((movie) => {
      const matches = moodMatchCount(movie, moodSelections);
      const score = scoreMovie(movie, moodSelections);
      const weight = Math.max(1, score + matches * 3);
      return { movie, matches, score, weight };
    })
    .filter(
      ({ movie, matches }) =>
        !hasMoodConflict(movie, moodSelections) || matches >= 3,
    );
}

/** Weighted random sample so the same top titles are not picked every quiz. */
function weightedSample(
  candidates: RankedMovie[],
  count: number,
): Movie[] {
  const pool = [...candidates];
  const picked: Movie[] = [];

  while (picked.length < count && pool.length > 0) {
    const totalWeight = pool.reduce((sum, item) => sum + item.weight, 0);
    let roll = Math.random() * totalWeight;

    for (let i = 0; i < pool.length; i++) {
      roll -= pool[i].weight;
      if (roll <= 0) {
        picked.push(pool[i].movie);
        pool.splice(i, 1);
        break;
      }
    }
  }

  return picked;
}

function pickWithVariety(
  ranked: RankedMovie[],
  count: number,
  minMatches: number,
): Movie[] {
  const eligible = ranked.filter((item) => item.matches >= minMatches);
  if (eligible.length === 0) return [];

  const byMatches = new Map<number, RankedMovie[]>();
  for (const item of eligible) {
    const list = byMatches.get(item.matches) ?? [];
    list.push(item);
    byMatches.set(item.matches, list);
  }

  const matchLevels = [...byMatches.keys()].sort((a, b) => b - a);
  const picked: Movie[] = [];
  const seen = new Set<string>();

  for (const level of matchLevels) {
    if (picked.length >= count) break;

    const bucket = byMatches.get(level)!;
    const need = count - picked.length;
    const sample = weightedSample(
      bucket.filter((item) => !seen.has(item.movie.id)),
      need,
    );

    for (const movie of sample) {
      if (seen.has(movie.id)) continue;
      seen.add(movie.id);
      picked.push(movie);
    }
  }

  return picked;
}

type RecommendOptions = {
  count?: number;
  excludeIds?: string[];
  /** IDs to deprioritize when the pool is large enough (e.g. last quiz). */
  softExcludeIds?: string[];
};

export function recommendMovies(
  selectedTags: MoodTag[],
  {
    count = MOVIES_PER_BATCH,
    excludeIds = [],
    softExcludeIds = [],
  }: RecommendOptions = {},
): Movie[] {
  const exclude = new Set(excludeIds);
  const softExclude = new Set(softExcludeIds);
  const selectedEra = getSelectedEra(selectedTags);
  const moodSelections = getMoodSelections(selectedTags);
  const batchIndex = Math.floor(excludeIds.length / MOVIES_PER_BATCH);

  const pool = MOVIES.filter((movie) => {
    if (exclude.has(movie.id)) return false;
    if (selectedEra && !movieMatchesEra(movie, selectedEra)) return false;
    return true;
  });

  let ranked = buildRanked(pool, moodSelections);

  if (softExclude.size > 0 && pool.length > count + softExclude.size) {
    ranked = ranked.map((item) =>
      softExclude.has(item.movie.id)
        ? { ...item, weight: Math.max(1, Math.floor(item.weight * 0.15)) }
        : item,
    );
  }
  const picked: Movie[] = [];
  let minMatches = minMatchesForBatch(batchIndex, moodSelections.length);

  while (picked.length < count && minMatches >= 1) {
    const batch = pickWithVariety(
      ranked.filter((item) => !picked.some((m) => m.id === item.movie.id)),
      count - picked.length,
      minMatches,
    );
    picked.push(...batch);
    minMatches -= 1;
  }

  if (picked.length < count) {
    const fallback = weightedSample(
      ranked.filter((item) => !picked.some((m) => m.id === item.movie.id)),
      count - picked.length,
    );
    picked.push(...fallback);
  }

  return picked.slice(0, count);
}

export function canShowMoreMovies(currentCount: number): boolean {
  return currentCount < MAX_MOVIE_RESULTS;
}

export function remainingMovieSlots(currentCount: number): number {
  return Math.max(0, MAX_MOVIE_RESULTS - currentCount);
}

export function hasMoreRecommendations(
  selectedTags: MoodTag[],
  excludeIds: string[] = [],
): boolean {
  const slots = remainingMovieSlots(excludeIds.length);
  if (slots <= 0) return false;

  const more = recommendMovies(selectedTags, {
    count: 1,
    excludeIds,
  });

  return more.length > 0;
}
