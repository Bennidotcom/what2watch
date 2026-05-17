"use client";

import type { Question } from "@/types";
import { ProgressBar } from "./ProgressBar";

type QuestionCardProps = {
  question: Question;
  questionIndex: number;
  totalQuestions: number;
  onAnswer: (answerId: string) => void;
};

export function QuestionCard({
  question,
  questionIndex,
  totalQuestions,
  onAnswer,
}: QuestionCardProps) {
  return (
    <section className="w-full max-w-lg animate-fade-in">
      <article className="rounded-2xl border-2 border-zinc-400 bg-zinc-900/90 p-8 shadow-lg backdrop-blur-sm">
        <h2 className="mb-8 text-center text-xl font-medium leading-snug text-zinc-100 sm:text-2xl">
          {question.text}
        </h2>
        <ul className="flex flex-col gap-3">
          {question.answers.map((answer) => (
            <li key={answer.id}>
              <button
                type="button"
                onClick={() => onAnswer(answer.id)}
                className="w-full rounded-xl border border-zinc-500 bg-zinc-800/60 px-5 py-4 text-left text-zinc-200 transition hover:border-zinc-300 hover:bg-zinc-800 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-400"
              >
                {answer.label}
              </button>
            </li>
          ))}
        </ul>
        <ProgressBar current={questionIndex + 1} total={totalQuestions} />
      </article>
    </section>
  );
}
