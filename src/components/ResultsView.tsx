"use client";

import type { Movie } from "@/types";
import { MovieCard } from "./MovieCard";

type ResultsViewProps = {
  movies: Movie[];
  onMore: () => void;
  onRestart: () => void;
  canLoadMore: boolean;
};

export function ResultsView({
  movies,
  onMore,
  onRestart,
  canLoadMore,
}: ResultsViewProps) {
  return (
    <section className="w-full max-w-6xl animate-fade-in overflow-visible px-4 py-8">
      <header className="mb-8 text-center">
        <h2 className="text-xl font-semibold text-zinc-100 sm:text-2xl">
          Your picks for tonight
        </h2>
        <p className="mt-2 text-sm text-zinc-500">
          Hover a poster to enlarge and read details
        </p>
      </header>
      <section className="grid grid-cols-[repeat(auto-fill,minmax(140px,140px))] items-start justify-center gap-x-6 gap-y-8 overflow-visible px-4 pb-24 pt-4 sm:grid-cols-[repeat(auto-fill,minmax(160px,160px))] sm:gap-x-8">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </section>
      <footer className="mt-6 flex flex-wrap items-center justify-center gap-3">
        {canLoadMore && (
          <button
            type="button"
            onClick={onMore}
            className="rounded-full border-2 border-blue-500/80 bg-blue-500/10 px-6 py-2.5 text-sm font-medium text-blue-400 transition hover:border-blue-400 hover:bg-blue-500/20 hover:text-blue-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400"
          >
            Give me five more
          </button>
        )}
        <button
          type="button"
          onClick={onRestart}
          className="rounded-full border-2 border-zinc-400 px-6 py-2.5 text-sm font-medium text-zinc-300 transition hover:border-zinc-200 hover:bg-zinc-800 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-400"
        >
          Start over
        </button>
      </footer>
    </section>
  );
}
