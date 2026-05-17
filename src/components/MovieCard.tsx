"use client";

import { getPosterSrc } from "@/lib/poster";
import type { Movie } from "@/types";

type MovieCardProps = {
  movie: Movie;
};

export function MovieCard({ movie }: MovieCardProps) {
  const posterSrc = getPosterSrc(movie);

  return (
    <article className="group relative z-0 flex w-[140px] shrink-0 origin-top flex-col transition-all duration-300 ease-out hover:z-30 hover:scale-[1.75] sm:w-[160px] sm:hover:scale-[1.85]">
      <section className="overflow-hidden rounded-lg border-2 border-zinc-400 bg-zinc-900 shadow-xl transition group-hover:border-zinc-200 group-hover:shadow-2xl">
        <section className="relative aspect-[2/3] w-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={posterSrc}
            alt={`${movie.title} poster`}
            referrerPolicy="no-referrer"
            loading="lazy"
            className="h-full w-full object-cover"
          />
          <section
            className="absolute inset-0 overflow-y-auto overscroll-contain bg-gradient-to-t from-zinc-950 from-40% via-zinc-950/98 to-zinc-950/30 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            aria-hidden
          >
            <div className="flex min-h-full flex-col justify-end p-3">
              <p className="mb-2 text-[11px] leading-snug text-zinc-100 sm:text-xs sm:leading-relaxed">
                {movie.description}
              </p>
              <p className="text-[10px] leading-snug text-zinc-300 sm:text-[11px]">
                <span className="font-semibold text-zinc-100">Cast:</span>{" "}
                {movie.cast.join(", ")}
              </p>
              <p className="mt-1 text-[10px] leading-snug text-zinc-400 sm:text-[11px]">
                <span className="text-zinc-300">Director:</span> {movie.director}
              </p>
              <p className="text-[10px] leading-snug text-zinc-400 sm:text-[11px]">
                <span className="text-zinc-300">Writer:</span> {movie.writer}
              </p>
            </div>
          </section>
        </section>
      </section>
      <div className="mt-2 flex min-h-[2.75rem] flex-col justify-start">
        <h3 className="line-clamp-2 text-center text-sm font-medium leading-snug text-zinc-100 transition group-hover:text-white">
          {movie.title}
        </h3>
      </div>
      <p className="text-center text-xs text-zinc-500">{movie.year}</p>
    </article>
  );
}
