import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useMemo, useState } from "react";

import { ChampionCard } from "@/components/game/ChampionCard";
import { Leaderboard } from "@/components/game/Leaderboard";
import { LeverBoard } from "@/components/game/LeverBoard";
import { RevealPanel } from "@/components/game/RevealPanel";
import {
  drivers,
  grade,
  HORIZON_LABEL,
  rankAll,
  score,
  SCENARIOS,
  TECHS,
  type Horizon,
  type ScenarioCard,
  type Tech,
  type World,
} from "@/lib/tailwinds";

const TITLE = "Tailwinds — bet on which technologies a world rewards";
const DESCRIPTION =
  "A five-move strategy game. You are dealt a world and a technology to champion. Nudge the levers that shape the future and find out which sectors get a tailwind.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
    ],
  }),
  component: TailwindsGame,
});

const MOVES_PER_ROUND = 5;
const HORIZONS: Horizon[] = [3, 5, 10];

type Round = {
  scenario: ScenarioCard;
  champion: Tech;
  horizon: Horizon;
};

function pick<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)]!;
}

/**
 * The very first round is fixed so server and client render the same HTML.
 * Every later round is dealt at random, client-side.
 */
const OPENING_ROUND: Round = {
  scenario: SCENARIOS[0]!,
  champion: TECHS.find((t) => t.name === "Nuclear fission & SMRs") ?? TECHS[0]!,
  horizon: 5,
};

function dealRound(previous: Round): Round {
  let scenario = pick(SCENARIOS);
  let champion = pick(TECHS);
  let guard = 0;
  while (scenario.id === previous.scenario.id && guard++ < 12) scenario = pick(SCENARIOS);
  guard = 0;
  while (champion.name === previous.champion.name && guard++ < 12) champion = pick(TECHS);
  return { scenario, champion, horizon: pick(HORIZONS) };
}


/** A plain-language read of what the world is doing to the champion. */
function buildLesson(champion: Tech, world: World, horizon: Horizon): string {
  const ds = drivers(champion, world, horizon);
  const top = ds[0];
  const second = ds[1];
  if (!top || Math.abs(top.contribution) < 0.05) {
    return `${champion.name} is nearly indifferent to this world — none of its levers moved far enough from the midpoint to matter over ${horizon} years.`;
  }
  const dir = top.contribution >= 0 ? "lifts" : "punishes";
  let text = `Over ${horizon} years, ${top.name.toLowerCase()} at "${top.pole}" ${dir} ${champion.name.toLowerCase()} hardest.`;
  if (second && Math.abs(second.contribution) >= 0.05) {
    const dir2 = second.contribution >= 0 ? "adds lift" : "cuts against it";
    text += ` ${second.name} at "${second.pole}" ${dir2}.`;
  }
  const slow = ds.find((d) => Math.abs(d.contribution) < 0.12 && Math.abs(d.contribution) > 0);
  if (slow && horizon === 3) {
    text += ` Slow levers like ${slow.name.toLowerCase()} barely register this early.`;
  }
  return text;
}

function TailwindsGame() {
  const [round, setRound] = useState<Round>(() => dealRound());
  const [world, setWorld] = useState<World>(() => ({ ...round.scenario.world }));
  const [movesLeft, setMovesLeft] = useState(MOVES_PER_ROUND);
  const [revealed, setRevealed] = useState(false);
  const [streak, setStreak] = useState(0);
  const [roundNo, setRoundNo] = useState(1);

  const { scenario, champion, horizon } = round;

  const ranked = useMemo(() => rankAll(world, horizon), [world, horizon]);
  const value = useMemo(() => score(champion.weights, world, horizon), [champion, world, horizon]);
  const championRank = ranked.find((r) => r.name === champion.name)?.rank ?? 25;
  const allDrivers = useMemo(() => drivers(champion, world, horizon), [champion, world, horizon]);
  const topDrivers = allDrivers.slice(0, 4);
  const lesson = useMemo(() => buildLesson(champion, world, horizon), [champion, world, horizon]);
  const result = grade(value, championRank);
  const leader = ranked[0]!;

  const nudge = useCallback(
    (leverId: string, delta: number) => {
      if (revealed || movesLeft <= 0) return;
      setWorld((prev) => {
        const current = prev[leverId] ?? 50;
        const next = Math.max(0, Math.min(100, current + delta));
        if (next === current) return prev;
        setMovesLeft((m) => m - 1);
        return { ...prev, [leverId]: next };
      });
    },
    [revealed, movesLeft],
  );

  const cashOut = useCallback(() => {
    setRevealed(true);
    setStreak((s) => (value >= 12 ? s + 1 : 0));
  }, [value]);

  const nextRound = useCallback(() => {
    const next = dealRound(round);
    setRound(next);
    setWorld({ ...next.scenario.world });
    setMovesLeft(MOVES_PER_ROUND);
    setRevealed(false);
    setRoundNo((n) => n + 1);
  }, [round]);

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto flex max-w-6xl flex-col gap-5 px-4 py-6 sm:px-6 lg:px-8">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="surface-lacquer piece grid size-11 shrink-0 place-items-center rounded-lg">
              <span className="font-mono text-base font-extrabold text-primary-foreground">TW</span>
            </div>
            <div className="leading-none">
              <h1 className="font-mono text-2xl font-extrabold tracking-tight">TAILWINDS</h1>
              <p className="mt-1 text-xs font-medium text-muted-foreground">
                15 levers · 25 sectors · one world
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="surface-plate piece rounded-lg px-3 py-1.5 font-mono text-xs font-bold tracking-wide">
              ROUND {String(roundNo).padStart(2, "0")}
            </span>
            <span className="surface-plate piece rounded-lg px-3 py-1.5 font-mono text-xs font-bold tracking-wide">
              {HORIZON_LABEL[horizon]} VIEW
            </span>
            <span className="piece rounded-lg bg-accent px-3 py-1.5 font-mono text-xs font-bold tracking-wide text-accent-foreground">
              STREAK {streak}
            </span>
          </div>
        </header>

        <section className="surface-plate piece-lg rounded-xl px-4 py-3">
          <p className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-destructive">
            Dealt world — {scenario.name}
          </p>
          <p className="mt-1 text-sm text-foreground/80">{scenario.blurb}</p>
          <p className="mt-1.5 text-xs text-muted-foreground">
            You have {MOVES_PER_ROUND} nudges. Bend this world so your sector catches the wind — the
            leaderboard shows every knock-on effect as you go.
          </p>
        </section>

        <div className="grid gap-5 lg:grid-cols-12">
          <div className="lg:col-span-5">
            {revealed ? (
              <RevealPanel
                champion={champion.name}
                scenarioName={scenario.name}
                value={value}
                rank={championRank}
                best={leader.name}
                bestValue={leader.value}
                grade={result}
                lesson={lesson}
                helped={allDrivers.filter((d) => d.contribution > 0.05).slice(0, 3)}
                hurt={allDrivers.filter((d) => d.contribution < -0.05).slice(0, 3)}
                streak={streak}
                onNext={nextRound}
              />
            ) : (
              <ChampionCard
                champion={champion.name}
                value={value}
                rank={championRank}
                movesLeft={movesLeft}
                topDrivers={topDrivers}
                onCashOut={cashOut}
                locked={false}
              />
            )}
          </div>

          <div className="lg:col-span-7">
            <LeverBoard
              world={world}
              baseWorld={scenario.world}
              movesLeft={movesLeft}
              disabled={revealed || movesLeft <= 0}
              onNudge={nudge}
            />
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Leaderboard ranked={ranked} champion={champion.name} />
          </div>

          <div className="lg:col-span-5">
            <h3 className="mb-2 font-mono text-sm font-extrabold uppercase tracking-wide">
              Reading the world
            </h3>
            <div className="surface-lacquer piece-lg rounded-xl p-4">
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-primary-foreground/55">
                Live causal read
              </p>
              <p className="mt-2 text-sm leading-relaxed text-primary-foreground/90">{lesson}</p>
              <p className="mt-3 text-[11px] leading-relaxed text-primary-foreground/50">
                Fast levers shape the 3 year view, slow ones only bite by year 10. The index runs
                &minus;50 to +50 and says whether a world helps or hurts a sector, not how big the
                market gets.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
