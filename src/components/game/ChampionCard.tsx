import { fmt, type Driver } from "@/lib/tailwinds";

type Props = {
  champion: string;
  value: number;
  rank: number;
  movesLeft: number;
  topDrivers: Driver[];
  onCashOut: () => void;
  locked: boolean;
};

export function ChampionCard({
  champion,
  value,
  rank,
  movesLeft,
  topDrivers,
  onCashOut,
  locked,
}: Props) {
  const positive = value >= 0;

  return (
    <div className="surface-lacquer piece-xl deal rounded-xl p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary-foreground/60">
            Your bet
          </p>
          <h2 className="mt-0.5 font-mono text-xl font-extrabold leading-tight text-primary-foreground sm:text-2xl">
            {champion}
          </h2>
        </div>
        <div className="shrink-0 rounded-md border border-primary-foreground/20 px-2 py-1 text-center">
          <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-primary-foreground/60">
            Moves
          </p>
          <p className="tabular font-mono text-lg font-extrabold leading-none text-primary-foreground">
            {movesLeft}
          </p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-end gap-3">
        <span
          key={Math.round(value)}
          className={`score-pop tabular font-mono text-6xl font-extrabold leading-none sm:text-7xl ${
            positive ? "text-tailwind" : "text-headwind"
          }`}
        >
          {fmt(value)}
        </span>
        <div className="pb-1.5">
          <p
            className={`font-mono text-sm font-bold uppercase tracking-[0.2em] ${
              positive ? "text-tailwind" : "text-headwind"
            }`}
          >
            {positive ? "Tailwind" : "Headwind"}
          </p>
          <p className="font-mono text-[11px] font-bold uppercase tracking-wider text-primary-foreground/50">
            Rank {String(rank).padStart(2, "0")} of 25
          </p>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-2.5">
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
        onClick={onCashOut}
        disabled={locked}
        className="pressable mt-5 w-full rounded-lg border-2 border-border bg-primary py-3 font-mono text-sm font-bold uppercase tracking-[0.12em] text-primary-foreground shadow-[4px_4px_0_0_var(--tailwind)] disabled:opacity-50"
      >
        Cash out this round
      </button>
    </div>
  );
}
