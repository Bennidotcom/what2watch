type ProgressBarProps = {
  current: number;
  total: number;
};

export function ProgressBar({ current, total }: ProgressBarProps) {
  const percent = (current / total) * 100;

  return (
    <section className="mt-8 w-full">
      <p className="mb-2 text-center text-xs text-zinc-500">
        Question {current} of {total}
      </p>
      <section className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-700">
        <span
          className="block h-full rounded-full bg-zinc-400 transition-all duration-300 ease-out"
          style={{ width: `${percent}%` }}
        />
      </section>
    </section>
  );
}
