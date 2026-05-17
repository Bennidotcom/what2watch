import type { Question } from "@/types";

export const QUESTIONS: Question[] = [
  {
    id: "energy",
    text: "How much energy do you have right now?",
    answers: [
      {
        id: "energy-low",
        label: "Not much — I want something calm",
        tags: ["energy-low"],
      },
      {
        id: "energy-medium",
        label: "I'm good — anything works",
        tags: ["energy-medium"],
      },
      {
        id: "energy-high",
        label: "Lots — hit me with something exciting",
        tags: ["energy-high"],
      },
    ],
  },
  {
    id: "emotion",
    text: "How do you want the movie to make you feel?",
    answers: [
      {
        id: "emotion-light",
        label: "Happy and easy — laughs are welcome",
        tags: ["emotion-light"],
      },
      {
        id: "emotion-thoughtful",
        label: "Thoughtful — something that sticks with me",
        tags: ["emotion-thoughtful"],
      },
      {
        id: "emotion-heavy",
        label: "Deep — I don't mind getting emotional",
        tags: ["emotion-heavy"],
      },
    ],
  },
  {
    id: "setting",
    text: "What kind of movie sounds good?",
    answers: [
      {
        id: "setting-intimate",
        label: "Small and personal — people, relationships",
        tags: ["setting-intimate"],
      },
      {
        id: "setting-expansive",
        label: "Big and adventurous — action, travel, scale",
        tags: ["setting-expansive"],
      },
      {
        id: "setting-surreal",
        label: "Strange or magical — not quite real life",
        tags: ["setting-surreal"],
      },
    ],
  },
  {
    id: "era",
    text: "When should the movie be from?",
    answers: [
      {
        id: "era-classic",
        label: "Older classics (before the 90s)",
        tags: ["era-classic"],
      },
      {
        id: "era-aughts",
        label: "2000s movies",
        tags: ["era-aughts"],
      },
      {
        id: "era-recent",
        label: "Newer stuff (2010 and later)",
        tags: ["era-recent"],
      },
    ],
  },
  {
    id: "audience",
    text: "Who are you watching with?",
    answers: [
      {
        id: "audience-solo",
        label: "Just me",
        tags: ["audience-solo"],
      },
      {
        id: "audience-date",
        label: "A date",
        tags: ["audience-date"],
      },
      {
        id: "audience-friends",
        label: "Friends",
        tags: ["audience-friends"],
      },
      {
        id: "audience-family",
        label: "Family",
        tags: ["audience-family"],
      },
    ],
  },
];

export const TOTAL_QUESTIONS = QUESTIONS.length;
