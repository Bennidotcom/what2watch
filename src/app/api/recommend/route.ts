import { NextResponse } from "next/server";
import { MAX_MOVIE_RESULTS, MOVIES_PER_BATCH } from "@/lib/constants";
import { recommendMoviesForUser } from "@/lib/recommend-server";
import type { MoodTag } from "@/types";

const VALID_TAGS = new Set<MoodTag>([
  "energy-low",
  "energy-medium",
  "energy-high",
  "emotion-light",
  "emotion-thoughtful",
  "emotion-heavy",
  "setting-intimate",
  "setting-expansive",
  "setting-surreal",
  "era-classic",
  "era-aughts",
  "era-recent",
  "audience-solo",
  "audience-date",
  "audience-friends",
  "audience-family",
]);

type Body = {
  tags?: string[];
  count?: number;
  excludeIds?: string[];
};

export async function POST(request: Request) {
  let body: Body;

  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const tags = (body.tags ?? []).filter((t): t is MoodTag =>
    VALID_TAGS.has(t as MoodTag),
  );

  if (tags.length < 4) {
    return NextResponse.json(
      { error: "At least four mood tags are required" },
      { status: 400 },
    );
  }

  const count = Math.min(
    Math.max(1, body.count ?? MOVIES_PER_BATCH),
    MOVIES_PER_BATCH,
  );
  const excludeIds = Array.isArray(body.excludeIds)
    ? body.excludeIds.filter((id) => typeof id === "string")
    : [];

  try {
    const result = await recommendMoviesForUser(tags, count, excludeIds);

    if (result.movies.length < count) {
      return NextResponse.json(
        {
          error: `Only found ${result.movies.length} movies. Set TMDB_API_KEY for a full catalog.`,
          movies: result.movies,
          tmdbEnabled: result.tmdbEnabled,
        },
        { status: 503 },
      );
    }

    const totalAfter = excludeIds.length + result.movies.length;

    return NextResponse.json({
      movies: result.movies,
      source: result.source,
      tmdbEnabled: result.tmdbEnabled,
      canLoadMore: totalAfter < MAX_MOVIE_RESULTS,
      warning:
        !result.tmdbEnabled
          ? "TMDB_API_KEY is not set — using limited offline movies only."
          : undefined,
    });
  } catch (error) {
    console.error("Recommend API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch movie recommendations" },
      { status: 500 },
    );
  }
}
