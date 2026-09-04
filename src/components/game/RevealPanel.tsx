import { fmt, type Driver, type Grade } from "@/lib/tailwinds";

type Props = {
  champion: string;
  scenarioName: string;
  value: number;
  rank: number;
  best: string;
  bestValue: number;
  grade: Grade;
  lesson: string;
  helped: Driver[];
  hurt: Driver[];
  streak: number;
  onNext: () => void;
};

export function RevealPanel({
  champion,
  scenarioName,
  value,
  rank,
  best,
  bestValue,
  grade,
  lesson,
  helped,
  hurt,
  streak,
  onNext,
}: Props) {
  return (
    <div className="surface-lacquer piece-xl deal rounded-xl p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-primary-foreground/60">
          Round closed · {scenarioName}
        </p>
        <span className="rounded-md border border-primary-foreground/20 px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-primary-foreground/70">
          Streak {streak}
        </span>
      </div>

      <h2
        className={`mt-2 font-mono text-3xl font-extrabold leading-none sm:text-4xl ${
          grade.tone === "loss" ? "text-headwind" : grade.tone === "mid" ? "text-primary-foreground" : "text-tailwind"
        }`}
      >
        {grade.label}
      </h2>
      <p className="mt-2 max-w-prose text-sm leading-relaxed text-primary-foreground/85">{grade.note}</p>

      <div className="mt-4 grid grid-cols-3 gap-2.5">
        <div className="piece rounded-lg bg-background p-2.5">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Your index</p>
          <p
            className={`tabular font-mono text-2xl font-extrabold ${value >= 0 ? "text-tailwind" : "text-headwind"}`}
          >
            {fmt(value)}
          </p>
        </div>
        <div className="piece rounded-lg bg-background p-2.5">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Rank</p>
          <p className="tabular font-mono text-2xl font-extrabold">{String(rank).padStart(2, "0")}</p>
        </div>
        <div className="piece rounded-lg bg-background p-2.5">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Board leader</p>
          <p className="mt-0.5 truncate text-[11px] font-semibold leading-tight">{best}</p>
          <p className="tabular font-mono text-xs font-bold text-tailwind">{fmt(bestValue)}</p>
        </div>
      </div>

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
        You were betting on <span className="font-medium text-primary-foreground/70">{champion}</span>. Weights are
        judgment, not measured data — read this as a thinking tool, not a forecast.
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
