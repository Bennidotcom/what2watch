"use client";

import { getPosterSrc } from "@/lib/poster";
import type { Movie } from "@/types";

type MovieCardProps = {
  movie: Movie;
  isSelected: boolean;
  onSelect: () => void;
};

export function MovieCard({ movie, isSelected, onSelect }: MovieCardProps) {
  const posterSrc = getPosterSrc(movie);

  return (
    <article
      className={[
        "group relative z-0 flex w-[140px] shrink-0 origin-top flex-col transition-all duration-300 ease-out sm:w-[160px]",
        "md:hover:z-30 md:hover:scale-[1.75] lg:hover:scale-[1.85]",
        isSelected ? "z-40 scale-[1.4] max-md:shadow-2xl" : "",
      ].join(" ")}
    >
      <button
        type="button"
        onClick={onSelect}
        aria-expanded={isSelected}
        aria-label={`${movie.title} (${movie.year}). Tap for plot and credits.`}
        className="w-full rounded-lg border-2 border-zinc-400 bg-zinc-900 text-left shadow-xl transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400 max-md:active:border-zinc-200 md:cursor-default md:group-hover:border-zinc-200 md:group-hover:shadow-2xl"
      >
        <span className="relative block aspect-[2/3] w-full overflow-hidden rounded-[6px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={posterSrc}
            alt=""
            referrerPolicy="no-referrer"
            loading="lazy"
            className="h-full w-full object-cover"
          />
          <span
            className={[
              "absolute inset-0 overflow-y-auto overscroll-contain bg-gradient-to-t from-zinc-950 from-40% via-zinc-950/98 to-zinc-950/30 transition-opacity duration-300",
              "pointer-events-none opacity-0 max-md:touch-pan-y",
              isSelected && "max-md:pointer-events-auto max-md:opacity-100",
              "md:group-hover:pointer-events-auto md:group-hover:opacity-100",
            ]
              .filter(Boolean)
              .join(" ")}
            aria-hidden={!isSelected}
          >
            <span className="flex min-h-full flex-col justify-end p-3">
              <span className="mb-2 block text-[11px] leading-snug text-zinc-100">
                {movie.description}
              </span>
              <span className="block text-[10px] leading-snug text-zinc-300">
                <span className="font-semibold text-zinc-100">Cast:</span>{" "}
                {movie.cast.join(", ")}
              </span>
              <span className="mt-1 block text-[10px] leading-snug text-zinc-400">
                <span className="text-zinc-300">Director:</span> {movie.director}
              </span>
              <span className="block text-[10px] leading-snug text-zinc-400">
                <span className="text-zinc-300">Writer:</span> {movie.writer}
              </span>
            </span>
          </span>
        </span>
      </button>
      <div className="pointer-events-none mt-2 flex min-h-[2.75rem] flex-col justify-start">
        <h3 className="line-clamp-2 text-center text-sm font-medium leading-snug text-zinc-100 md:group-hover:text-white">
          {movie.title}
        </h3>
      </div>
      <p className="pointer-events-none text-center text-xs text-zinc-500">
        {movie.year}
      </p>
    </article>
  );
}
