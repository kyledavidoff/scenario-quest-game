import { LEVERS, type World } from "@/lib/tailwinds";

const SPEED_TAG: Record<string, string> = {
  fast: "FAST",
  medium: "MED",
  slow: "SLOW",
};

type Props = {
  world: World;
  baseWorld: World;
  movesLeft: number;
  disabled: boolean;
  notice?: string;
  onNudge: (leverId: string, delta: number) => void;
};

export function LeverBoard({ world, baseWorld, movesLeft, disabled, notice, onNudge }: Props) {
  return (
    <div className="surface-plate piece-lg rounded-xl p-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="font-mono text-sm font-extrabold uppercase tracking-wide">The board</h2>
        <p className="text-xs font-medium text-muted-foreground">
          {notice ?? `Each nudge costs one move. ${movesLeft} left.`}
        </p>
      </div>


      <div className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
        {LEVERS.map((lever) => {
          const value = world[lever.id] ?? 50;
          const base = baseWorld[lever.id] ?? 50;
          const moved = value !== base;
          return (
            <div
              key={lever.id}
              className={`piece rounded-lg bg-background p-2.5 ${moved ? "ring-2 ring-ring ring-offset-1 ring-offset-background" : ""}`}
            >
              <div className="flex items-start justify-between gap-2">
                <span className="text-[13px] font-semibold leading-tight">{lever.name}</span>
                <span className="font-mono text-[9px] font-bold tracking-wider text-muted-foreground">
                  {SPEED_TAG[lever.speed]}
                </span>
              </div>

              <div className="relative mt-2 h-2 rounded-full bg-foreground/10">
                <span className="absolute left-1/2 top-[-2px] h-3 w-px bg-foreground/25" />
                <span
                  className="absolute top-[-3px] size-[14px] -translate-x-1/2 rounded-full border-2 border-foreground bg-background"
                  style={{ left: `${value}%` }}
                />
              </div>

              <div className="mt-2 flex items-center justify-between gap-1">
                <button
                  type="button"
                  aria-label={`Push ${lever.name} toward ${lever.lo}`}
                  disabled={disabled || value <= 0}
                  onClick={() => onNudge(lever.id, -25)}
                  className="pressable piece rounded-md bg-background px-2 py-0.5 font-mono text-xs font-bold disabled:opacity-25 disabled:shadow-none"
                >
                  ◀
                </button>
                <span className="min-w-0 flex-1 truncate px-1 text-center text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                  {value < 50 ? lever.lo : value > 50 ? lever.hi : "balanced"}
                </span>
                <button
                  type="button"
                  aria-label={`Push ${lever.name} toward ${lever.hi}`}
                  disabled={disabled || value >= 100}
                  onClick={() => onNudge(lever.id, 25)}
                  className="pressable piece rounded-md bg-background px-2 py-0.5 font-mono text-xs font-bold disabled:opacity-25 disabled:shadow-none"
                >
                  ▶
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
