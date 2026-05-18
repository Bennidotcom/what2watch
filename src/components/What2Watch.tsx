"use client";

import { useState } from "react";
import { QUESTIONS, TOTAL_QUESTIONS } from "@/data/questions";
import {
  canShowMoreMovies,
  hasMoreRecommendations,
  recommendMovies,
  remainingMovieSlots,
} from "@/lib/recommend";
import { MOVIES_PER_BATCH } from "@/lib/constants";
import {
  clearRecentMovieIds,
  getRecentMovieIds,
  rememberMovieIds,
} from "@/lib/recent-movies";
import type { MoodTag, Movie } from "@/types";
import { QuestionCard } from "./QuestionCard";
import { ResultsView } from "./ResultsView";

export function What2Watch() {
  const [step, setStep] = useState(0);
  const [selectedTags, setSelectedTags] = useState<MoodTag[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);

  const handleAnswer = (answerId: string) => {
    const question = QUESTIONS[step];
    const answer = question.answers.find((a) => a.id === answerId);
    if (!answer) return;

    const nextTags = [...selectedTags, ...answer.tags];
    const nextStep = step + 1;

    setSelectedTags(nextTags);

    if (nextStep >= TOTAL_QUESTIONS) {
      const recent = getRecentMovieIds();
      let picks = recommendMovies(nextTags, {
        count: MOVIES_PER_BATCH,
        softExcludeIds: recent,
      });

      if (picks.length < MOVIES_PER_BATCH) {
        picks = recommendMovies(nextTags, { count: MOVIES_PER_BATCH });
      }

      rememberMovieIds(picks.map((movie) => movie.id));
      setMovies(picks);
      setStep(nextStep);
      return;
    }

    setStep(nextStep);
  };

  const handleMore = () => {
    const slots = remainingMovieSlots(movies.length);
    if (slots <= 0) return;

    const more = recommendMovies(selectedTags, {
      count: Math.min(MOVIES_PER_BATCH, slots),
      excludeIds: movies.map((m) => m.id),
    });

    setMovies((current) => {
      const combined = [...current, ...more];
      rememberMovieIds(combined.map((movie) => movie.id));
      return combined;
    });
  };

  const handleRestart = () => {
    setStep(0);
    setSelectedTags([]);
    setMovies([]);
    clearRecentMovieIds();
  };

  const showResults = step >= TOTAL_QUESTIONS;
  const canLoadMore =
    canShowMoreMovies(movies.length) &&
    hasMoreRecommendations(
      selectedTags,
      movies.map((movie) => movie.id),
    );

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
          onMore={handleMore}
          onRestart={handleRestart}
          canLoadMore={canLoadMore}
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
