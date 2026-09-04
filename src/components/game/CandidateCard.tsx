import { fmt, type Driver } from "@/lib/tailwinds";

type Props = {
  candidates: string[];
  pick: string | null;
  signGuess: "tailwind" | "headwind" | null;
  value: number;
  movesLeft: number;
  topDrivers: Driver[];
  onPick: (name: string) => void;
  onSignGuess: (sign: "tailwind" | "headwind") => void;
  onLockIn: () => void;
};

export function CandidateCard({
  candidates,
  pick,
  signGuess,
  value,
  movesLeft,
  topDrivers,
  onPick,
  onSignGuess,
  onLockIn,
}: Props) {
  const positive = value >= 0;

  return (
    <div className="surface-lacquer piece-xl deal rounded-xl p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary-foreground/60">
            {pick ? "Your call" : "Which sector wins here?"}
          </p>
          <h2 className="mt-0.5 font-mono text-lg font-extrabold leading-tight text-primary-foreground sm:text-xl">
            {pick ?? "Pick one of three"}
          </h2>
        </div>
        {pick && (
          <div className="shrink-0 rounded-md border border-primary-foreground/20 px-2 py-1 text-center">
            <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-primary-foreground/60">
              Moves
            </p>
            <p className="tabular font-mono text-lg font-extrabold leading-none text-primary-foreground">
              {movesLeft}
            </p>
          </div>
        )}
      </div>

      <div className="mt-4 grid gap-2">
        {candidates.map((name) => {
          const chosen = name === pick;
          return (
            <button
              key={name}
              type="button"
              disabled={pick !== null}
              onClick={() => onPick(name)}
              className={`pressable flex items-center justify-between gap-3 rounded-lg border-2 px-3 py-2.5 text-left transition-opacity ${
                chosen
                  ? "border-tailwind bg-tailwind/20 text-primary-foreground shadow-[3px_3px_0_0_var(--tailwind)]"
                  : "border-primary-foreground/25 text-primary-foreground/85"
              } ${pick !== null && !chosen ? "opacity-35" : ""}`}
            >
              <span className="text-sm font-semibold leading-tight">{name}</span>
              {chosen && (
                <span className="shrink-0 font-mono text-[9px] font-bold uppercase tracking-wider text-tailwind">
                  picked
                </span>
              )}
            </button>
          );
        })}
      </div>

      {!pick && (
        <p className="mt-4 text-[11px] leading-relaxed text-primary-foreground/50">
          Read the world card and the board, then bet on the sector this world treats best. No scores
          until you commit.
        </p>
      )}

      {pick && (
        <>
          <div className="mt-5">
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-primary-foreground/55">
              Bonus call — tailwind or headwind?
            </p>
            <div className="mt-2 flex gap-2">
              {(["tailwind", "headwind"] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  disabled={signGuess !== null}
                  onClick={() => onSignGuess(s)}
                  className={`pressable flex-1 rounded-md border-2 py-1.5 font-mono text-[11px] font-bold uppercase tracking-wider ${
                    signGuess === s
                      ? s === "tailwind"
                        ? "border-tailwind bg-tailwind/25 text-tailwind"
                        : "border-headwind bg-headwind/25 text-headwind"
                      : "border-primary-foreground/25 text-primary-foreground/60"
                  } ${signGuess !== null && signGuess !== s ? "opacity-30" : ""}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-end gap-3">
            <span
              key={Math.round(value)}
              className={`score-pop tabular font-mono text-5xl font-extrabold leading-none sm:text-6xl ${
                positive ? "text-tailwind" : "text-headwind"
              }`}
            >
              {fmt(value)}
            </span>
            <p className="pb-1.5 font-mono text-[11px] font-bold uppercase tracking-wider text-primary-foreground/50">
              your pick, live
            </p>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2.5">
            {topDrivers.map((d) => (
              <div key={d.leverId} className="piece rounded-lg bg-background p-2.5">
                <p className="truncate text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                  {d.name}
                </p>
                <p className="mt-0.5 flex items-baseline justify-between gap-2">
                  <span className="truncate text-[11px] font-medium">{d.pole}</span>
                  <span
                    className={`tabular shrink-0 font-mono text-sm font-bold ${
                      d.contribution >= 0 ? "text-tailwind" : "text-headwind"
                    }`}
                  >
                    {d.contribution >= 0 ? "+" : "\u2212"}
                    {Math.abs(d.contribution).toFixed(2)}
                  </span>
                </p>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={onLockIn}
            className="pressable mt-5 w-full rounded-lg border-2 border-border bg-primary py-3 font-mono text-sm font-bold uppercase tracking-[0.12em] text-primary-foreground shadow-[4px_4px_0_0_var(--tailwind)]"
          >
            Lock in the answer
          </button>
        </>
      )}
    </div>
  );
}
