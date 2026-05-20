"use client";

import { useCallback, useState } from "react";
import { QUESTIONS, TOTAL_QUESTIONS } from "@/data/questions";
import { MOVIES_PER_BATCH } from "@/lib/constants";
import {
  clearRecentMovieIds,
  getRecentMovieIds,
  rememberMovieIds,
} from "@/lib/recent-movies";
import type { MoodTag, Movie } from "@/types";
import { QuestionCard } from "./QuestionCard";
import { ResultsView } from "./ResultsView";

type RecommendResponse = {
  movies: Movie[];
  canLoadMore: boolean;
  tmdbEnabled: boolean;
  warning?: string;
  error?: string;
};

async function requestMovies(
  tags: MoodTag[],
  excludeIds: string[],
): Promise<RecommendResponse> {
  const res = await fetch("/api/recommend", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      tags,
      count: MOVIES_PER_BATCH,
      excludeIds,
    }),
  });

  const data = (await res.json()) as RecommendResponse & { error?: string };

  if (!res.ok) {
    throw new Error(data.error ?? "Could not load movies");
  }

  if (!data.movies?.length) {
    throw new Error(
      data.error ??
        "No movies found. Add TMDB_API_KEY on the server (see README).",
    );
  }

  if (data.movies.length < MOVIES_PER_BATCH) {
    throw new Error(
      data.error ??
        `Only ${data.movies.length} movies available — add TMDB_API_KEY (see README).`,
    );
  }

  return {
    movies: data.movies,
    canLoadMore: data.canLoadMore ?? true,
    tmdbEnabled: data.tmdbEnabled ?? false,
    warning:
      data.warning ??
      (!data.tmdbEnabled
        ? "TMDB_API_KEY is not set — using limited offline movies only."
        : undefined),
  };
}

export function What2Watch() {
  const [step, setStep] = useState(0);
  const [selectedTags, setSelectedTags] = useState<MoodTag[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [canLoadMore, setCanLoadMore] = useState(true);
  const [warning, setWarning] = useState<string | null>(null);

  const loadMovies = useCallback(
    async (tags: MoodTag[], excludeIds: string[]) => {
      setLoading(true);
      setError(null);

      try {
        const recent = getRecentMovieIds();
        const result = await requestMovies(tags, [
          ...new Set([...excludeIds, ...recent]),
        ]);

        if (result.movies.length < MOVIES_PER_BATCH) {
          const fallback = await requestMovies(tags, excludeIds);
          result.movies = fallback.movies;
          result.warning = fallback.warning;
        }

        rememberMovieIds(result.movies.map((m) => m.id));
        setCanLoadMore(result.canLoadMore);
        setWarning(result.warning ?? null);
        return result.movies;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Something went wrong";
        setError(message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const handleAnswer = async (answerId: string) => {
    const question = QUESTIONS[step];
    const answer = question.answers.find((a) => a.id === answerId);
    if (!answer) return;

    const nextTags = [...selectedTags, ...answer.tags];
    const nextStep = step + 1;

    setSelectedTags(nextTags);

    if (nextStep >= TOTAL_QUESTIONS) {
      const picks = await loadMovies(nextTags, []);
      if (picks) setMovies(picks);
      setStep(nextStep);
      return;
    }

    setStep(nextStep);
  };

  const handleMore = async () => {
    if (loading || !canLoadMore) return;

    const more = await loadMovies(
      selectedTags,
      movies.map((m) => m.id),
    );

    if (more) {
      setMovies((current) => [...current, ...more]);
    }
  };

  const handleRestart = () => {
    setStep(0);
    setSelectedTags([]);
    setMovies([]);
    setError(null);
    setCanLoadMore(true);
    setWarning(null);
    clearRecentMovieIds();
  };

  const showResults = step >= TOTAL_QUESTIONS;

  return (
    <main className="flex min-h-full flex-1 flex-col items-center justify-center px-4 py-12">
      <header className="mb-8 text-center">
        <h1 className="text-2xl font-semibold tracking-tight text-blue-500 sm:text-3xl">
          What2Watch
        </h1>
        {!showResults && (
          <p className="mt-2 text-sm text-zinc-500">
            Answer 5 quick mood questions — we&apos;ll find your films
          </p>
        )}
      </header>

      {showResults ? (
        <ResultsView
          movies={movies}
          loading={loading}
          error={error}
          warning={warning}
          onMore={handleMore}
          onRestart={handleRestart}
          canLoadMore={canLoadMore && !loading}
        />
      ) : (
        <QuestionCard
          question={QUESTIONS[step]}
          questionIndex={step}
          totalQuestions={TOTAL_QUESTIONS}
          onAnswer={handleAnswer}
        />
      )}
    </main>
  );
}
