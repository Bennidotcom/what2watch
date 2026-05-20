"use client";

import { useState } from "react";
import type { Movie } from "@/types";
import { MovieCard } from "./MovieCard";

type ResultsViewProps = {
  movies: Movie[];
  loading: boolean;
  error: string | null;
  warning?: string | null;
  onMore: () => void;
  onRestart: () => void;
  canLoadMore: boolean;
};

export function ResultsView({
  movies,
  loading,
  error,
  warning,
  onMore,
  onRestart,
  canLoadMore,
}: ResultsViewProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  return (
    <section className="relative w-full max-w-6xl animate-fade-in overflow-visible px-4 py-8">
      {selectedId && (
        <button
          type="button"
          className="fixed inset-0 z-20 bg-black/70 md:hidden"
          aria-label="Close movie details"
          onClick={() => setSelectedId(null)}
        />
      )}

      <header className="relative z-10 mb-8 text-center">
        <h2 className="text-xl font-semibold text-zinc-100 sm:text-2xl">
          Your picks for tonight
        </h2>
        <p className="mt-2 text-sm text-zinc-500">
          <span className="md:hidden">
            Tap a poster for details — tap the dimmed area or another poster to
            close
          </span>
          <span className="hidden md:inline">
            Hover a poster to enlarge and read details
          </span>
        </p>
      </header>

      {warning && !error && (
        <p className="relative z-10 mb-6 rounded-lg border border-amber-500/40 bg-amber-950/30 px-4 py-3 text-center text-sm text-amber-100/90">
          {warning}
        </p>
      )}

      {error && (
        <p className="relative z-10 mb-6 rounded-lg border border-red-500/50 bg-red-950/40 px-4 py-3 text-center text-sm text-red-200">
          {error}
        </p>
      )}

      {loading && movies.length === 0 && (
        <p className="relative z-10 mb-8 text-center text-sm text-zinc-400">
          Finding movies for you…
        </p>
      )}

      {loading && movies.length > 0 && (
        <p className="relative z-10 -mt-4 mb-6 text-center text-sm text-zinc-500">
          Loading five more…
        </p>
      )}

      <section className="relative z-30 grid grid-cols-[repeat(auto-fill,minmax(140px,140px))] items-start justify-center gap-x-6 gap-y-8 overflow-visible px-4 pb-24 pt-4 sm:grid-cols-[repeat(auto-fill,minmax(160px,160px))] sm:gap-x-8">
        {movies.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            isSelected={selectedId === movie.id}
            onSelect={() => setSelectedId(movie.id)}
          />
        ))}
      </section>

      <footer className="relative z-10 mt-6 flex flex-wrap items-center justify-center gap-3">
        {canLoadMore && (
          <button
            type="button"
            onClick={onMore}
            disabled={loading}
            className="rounded-full border-2 border-blue-500/80 bg-blue-500/10 px-6 py-2.5 text-sm font-medium text-blue-400 transition hover:border-blue-400 hover:bg-blue-500/20 hover:text-blue-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Loading…" : "Give me five more"}
          </button>
        )}
        <button
          type="button"
          onClick={onRestart}
          disabled={loading}
          className="rounded-full border-2 border-zinc-400 px-6 py-2.5 text-sm font-medium text-zinc-300 transition hover:border-zinc-200 hover:bg-zinc-800 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-400 disabled:opacity-50"
        >
          Start over
        </button>
      </footer>
    </section>
  );
}
