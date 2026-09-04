import { fmt, type Driver } from "@/lib/tailwinds";

export type CandidateResult = { name: string; value: number };

type Props = {
  scenarioName: string;
  pick: string;
  results: CandidateResult[];
  correct: boolean;
  signCorrect: boolean | null;
  points: number;
  lesson: string;
  helped: Driver[];
  hurt: Driver[];
  streak: number;
  onNext: () => void;
};

export function RevealPanel({
  scenarioName,
  pick,
  results,
  correct,
  signCorrect,
  points,
  lesson,
  helped,
  hurt,
  streak,
  onNext,
}: Props) {
  const sorted = [...results].sort((a, b) => b.value - a.value);
  const winner = sorted[0]!;

  return (
    <div className="surface-lacquer piece-xl deal rounded-xl p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-primary-foreground/60">
          Answer · {scenarioName}
        </p>
        <span className="rounded-md border border-primary-foreground/20 px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-primary-foreground/70">
          Streak {streak}
        </span>
      </div>

      <h2
        className={`mt-2 font-mono text-3xl font-extrabold leading-none sm:text-4xl ${
          correct ? "text-tailwind" : "text-headwind"
        }`}
      >
        {correct ? "Called it" : "Missed it"}
      </h2>
      <p className="mt-2 max-w-prose text-sm leading-relaxed text-primary-foreground/85">
        {correct
          ? `${pick} does come out on top of your three in this world.`
          : `${winner.name} beats your pick, ${pick}, in this world.`}
        {signCorrect !== null &&
          (signCorrect
            ? " Your tailwind/headwind call was right too."
            : " Your tailwind/headwind call was off.")}
        {` +${points} point${points === 1 ? "" : "s"} this round.`}
      </p>

      <ul className="mt-4 space-y-2">
        {sorted.map((r, i) => {
          const isPick = r.name === pick;
          return (
            <li
              key={r.name}
              className={`flex items-center justify-between gap-3 rounded-lg border-2 px-3 py-2 ${
                isPick
                  ? correct
                    ? "border-tailwind bg-tailwind/15"
                    : "border-headwind bg-headwind/15"
                  : "border-primary-foreground/20"
              }`}
            >
              <div className="flex min-w-0 items-center gap-2.5">
                <span className="w-4 shrink-0 font-mono text-xs font-bold text-primary-foreground/50">
                  {i + 1}
                </span>
                <span className="truncate text-sm font-semibold text-primary-foreground">
                  {r.name}
                  {isPick && (
                    <span className="ml-2 font-mono text-[9px] font-bold uppercase tracking-wider text-primary-foreground/60">
                      your pick
                    </span>
                  )}
                </span>
              </div>
              <span
                className={`tabular shrink-0 font-mono text-lg font-extrabold ${
                  r.value >= 0 ? "text-tailwind" : "text-headwind"
                }`}
              >
                {fmt(r.value)}
              </span>
            </li>
          );
        })}
      </ul>

      <div className="mt-4 rounded-lg border border-primary-foreground/15 p-3">
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-primary-foreground/55">
          Why it moved
        </p>
        <p className="mt-1.5 text-sm leading-relaxed text-primary-foreground/90">{lesson}</p>

        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <div>
            <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-tailwind">Worked for you</p>
            <ul className="mt-1 space-y-0.5">
              {helped.length === 0 && (
                <li className="text-xs text-primary-foreground/50">Nothing pulled in your favor.</li>
              )}
              {helped.map((d) => (
                <li key={d.leverId} className="text-xs text-primary-foreground/80">
                  {d.name} → <span className="font-medium">{d.pole}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-headwind">Worked against you</p>
            <ul className="mt-1 space-y-0.5">
              {hurt.length === 0 && (
                <li className="text-xs text-primary-foreground/50">Nothing cut against you.</li>
              )}
              {hurt.map((d) => (
                <li key={d.leverId} className="text-xs text-primary-foreground/80">
                  {d.name} → <span className="font-medium">{d.pole}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <p className="mt-3 text-[11px] leading-relaxed text-primary-foreground/45">
        Weights are judgment, not measured data — read this as a thinking tool, not a forecast.
      </p>

      <button
        type="button"
        onClick={onNext}
        className="pressable mt-4 w-full rounded-lg border-2 border-border bg-destructive py-3 font-mono text-sm font-bold uppercase tracking-[0.12em] text-destructive-foreground shadow-[4px_4px_0_0_var(--border)]"
      >
        Deal the next world
      </button>
    </div>
  );
}
