export type MoodTag =
  | "energy-low"
  | "energy-medium"
  | "energy-high"
  | "emotion-light"
  | "emotion-thoughtful"
  | "emotion-heavy"
  | "setting-intimate"
  | "setting-expansive"
  | "setting-surreal"
  | "era-classic"
  | "era-aughts"
  | "era-recent"
  | "audience-solo"
  | "audience-date"
  | "audience-friends"
  | "audience-family";

export type Answer = {
  id: string;
  label: string;
  tags: MoodTag[];
};

export type Question = {
  id: string;
  text: string;
  answers: Answer[];
};

export type Movie = {
  id: string;
  title: string;
  year: number;
  /** TMDB path e.g. /abc.jpg, or site path e.g. /posters/foo.jpg */
  posterPath: string;
  description: string;
  cast: string[];
  director: string;
  writer: string;
  tags: MoodTag[];
};
