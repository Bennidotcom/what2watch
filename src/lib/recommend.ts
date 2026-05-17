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
  return movie.tags.includes(era);
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
  if (batchIndex <= 0) return totalMood;
  if (batchIndex <= 2) return Math.min(3, totalMood);
  return Math.min(2, totalMood);
}

function hasMoodConflict(movie: Movie, moodSelections: MoodTag[]): boolean {
  return moodConflictPenalty(movie, moodSelections) > 0;
}

type RecommendOptions = {
  count?: number;
  excludeIds?: string[];
};

export function recommendMovies(
  selectedTags: MoodTag[],
  { count = MOVIES_PER_BATCH, excludeIds = [] }: RecommendOptions = {},
): Movie[] {
  const exclude = new Set(excludeIds);
  const selectedEra = getSelectedEra(selectedTags);
  const moodSelections = getMoodSelections(selectedTags);
  const batchIndex = Math.floor(excludeIds.length / MOVIES_PER_BATCH);

  const pool = MOVIES.filter((movie) => {
    if (exclude.has(movie.id)) return false;
    if (selectedEra && !movieMatchesEra(movie, selectedEra)) return false;
    return true;
  });

  const ranked = pool
    .map((movie) => ({
      movie,
      matches: moodMatchCount(movie, moodSelections),
      score: scoreMovie(movie, moodSelections),
    }))
    .sort((a, b) => {
      if (b.matches !== a.matches) return b.matches - a.matches;
      if (b.score !== a.score) return b.score - a.score;
      return a.movie.title.localeCompare(b.movie.title);
    });

  const picked: Movie[] = [];
  const seen = new Set<string>();

  const tryPick = (minMatches: number) => {
    for (const { movie, matches } of ranked) {
      if (picked.length >= count) break;
      if (seen.has(movie.id)) continue;
      if (matches < minMatches) continue;
      if (
        matches < moodSelections.length &&
        hasMoodConflict(movie, moodSelections)
      ) {
        continue;
      }
      seen.add(movie.id);
      picked.push(movie);
    }
  };

  let minMatches = minMatchesForBatch(batchIndex, moodSelections.length);

  while (picked.length < count && minMatches >= 1) {
    tryPick(minMatches);
    minMatches -= 1;
  }

  for (const { movie } of ranked) {
    if (picked.length >= count) break;
    if (seen.has(movie.id)) continue;
    seen.add(movie.id);
    picked.push(movie);
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
