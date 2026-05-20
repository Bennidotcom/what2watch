export type TmdbMovieResult = {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  release_date: string;
  vote_count: number;
  popularity: number;
};

export type TmdbDiscoverResponse = {
  page: number;
  results: TmdbMovieResult[];
  total_pages: number;
};

export type TmdbCastMember = {
  name: string;
  character?: string;
  order: number;
};

export type TmdbCrewMember = {
  name: string;
  job: string;
};

export type TmdbMovieDetails = TmdbMovieResult & {
  credits?: {
    cast: TmdbCastMember[];
    crew: TmdbCrewMember[];
  };
};
