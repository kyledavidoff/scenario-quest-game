import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useMemo, useState } from "react";

import { CandidateCard } from "@/components/game/CandidateCard";
import { Leaderboard } from "@/components/game/Leaderboard";
import { LeverBoard } from "@/components/game/LeverBoard";
import { RevealPanel } from "@/components/game/RevealPanel";
import {
  drivers,
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

const TITLE = "Tailwinds — guess which technology a world rewards";
const DESCRIPTION =
  "A quick guessing game. You are dealt a world and three technology sectors. Read the levers, call the winner, then see the answer and why it moved.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TailwindsGame,
});

const MOVES_PER_ROUND = 2;
const HORIZONS: Horizon[] = [3, 5, 10];

type Round = {
  scenario: ScenarioCard;
  candidates: Tech[];
  horizon: Horizon;
};

function pick<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)]!;
}

function techByName(name: string): Tech {
  return TECHS.find((t) => t.name === name) ?? TECHS[0]!;
}

/**
 * The very first round is fixed so server and client render the same HTML.
 * Every later round is dealt at random, client-side.
 */
const OPENING_ROUND: Round = {
  scenario: SCENARIOS[0]!,
  candidates: [
    techByName("Nuclear fission & SMRs"),
    techByName(TECHS[3]!.name),
    techByName(TECHS[7]!.name),
  ],
  horizon: 5,
};

function dealRound(previous: Round): Round {
  let scenario = pick(SCENARIOS);
  let guard = 0;
  while (scenario.id === previous.scenario.id && guard++ < 12) scenario = pick(SCENARIOS);

  const chosen: Tech[] = [];
  guard = 0;
  while (chosen.length < 3 && guard++ < 200) {
    const t = pick(TECHS);
    if (chosen.some((c) => c.name === t.name)) continue;
    chosen.push(t);
  }
  return { scenario, candidates: chosen, horizon: pick(HORIZONS) };
}

/** A plain-language read of what the world is doing to the picked sector. */
function buildLesson(tech: Tech, world: World, horizon: Horizon): string {
  const ds = drivers(tech, world, horizon);
  const top = ds[0];
  const second = ds[1];
  if (!top || Math.abs(top.contribution) < 0.05) {
    return `${tech.name} is nearly indifferent to this world — none of its levers moved far enough from the midpoint to matter over ${horizon} years.`;
  }
  const dir = top.contribution >= 0 ? "lifts" : "punishes";
  let text = `Over ${horizon} years, ${top.name.toLowerCase()} at "${top.pole}" ${dir} ${tech.name} hardest.`;
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
  const [round, setRound] = useState<Round>(() => OPENING_ROUND);
  const [world, setWorld] = useState<World>(() => ({ ...OPENING_ROUND.scenario.world }));
  const [pickName, setPickName] = useState<string | null>(null);
  const [signGuess, setSignGuess] = useState<"tailwind" | "headwind" | null>(null);
  const [movesLeft, setMovesLeft] = useState(MOVES_PER_ROUND);
  const [revealed, setRevealed] = useState(false);
  const [streak, setStreak] = useState(0);
  const [points, setPoints] = useState(0);
  const [roundPoints, setRoundPoints] = useState(0);
  const [roundNo, setRoundNo] = useState(1);

  const { scenario, candidates, horizon } = round;

  const results = useMemo(
    () => candidates.map((t) => ({ name: t.name, value: score(t.weights, world, horizon) })),
    [candidates, world, horizon],
  );
  const picked = pickName ? techByName(pickName) : null;
  const pickValue = results.find((r) => r.name === pickName)?.value ?? 0;
  const allDrivers = useMemo(
    () => (picked ? drivers(picked, world, horizon) : []),
    [picked, world, horizon],
  );
  const lesson = useMemo(
    () => (picked ? buildLesson(picked, world, horizon) : ""),
    [picked, world, horizon],
  );
  const ranked = useMemo(() => rankAll(world, horizon), [world, horizon]);

  const bestValue = Math.max(...results.map((r) => r.value));
  const correct = pickValue >= bestValue;
  const signCorrect =
    signGuess === null ? null : signGuess === (pickValue >= 0 ? "tailwind" : "headwind");

  const nudge = useCallback(
    (leverId: string, delta: number) => {
      if (revealed || movesLeft <= 0 || !pickName) return;
      const current = world[leverId] ?? 50;
      const next = Math.max(0, Math.min(100, current + delta));
      if (next === current) return;
      setWorld({ ...world, [leverId]: next });
      setMovesLeft(movesLeft - 1);
    },
    [revealed, movesLeft, pickName, world],

  );

  const lockIn = useCallback(() => {
    const earned = (correct ? 2 : 0) + (signCorrect ? 1 : 0);
    setRoundPoints(earned);
    setPoints((p) => p + earned);
    setStreak((s) => (correct ? s + 1 : 0));
    setRevealed(true);
  }, [correct, signCorrect]);

  const nextRound = useCallback(() => {
    const next = dealRound(round);
    setRound(next);
    setWorld({ ...next.scenario.world });
    setPickName(null);
    setSignGuess(null);
    setMovesLeft(MOVES_PER_ROUND);
    setRevealed(false);
    setRoundNo((n) => n + 1);
  }, [round]);

  const candidateNames = candidates.map((c) => c.name);

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
                guess the sector the world rewards
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
            <span className="surface-plate piece rounded-lg px-3 py-1.5 font-mono text-xs font-bold tracking-wide">
              SCORE {points}
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
            Guess which of the three sectors this world rewards most over {horizon} years. After you
            commit you get {MOVES_PER_ROUND} nudges to bend the world your way.
          </p>
        </section>

        <div className="grid gap-5 lg:grid-cols-12">
          <div className="lg:col-span-5">
            {revealed && pickName ? (
              <RevealPanel
                scenarioName={scenario.name}
                pick={pickName}
                results={results}
                correct={correct}
                signCorrect={signCorrect}
                points={roundPoints}
                lesson={lesson}
                helped={allDrivers.filter((d) => d.contribution > 0.05).slice(0, 3)}
                hurt={allDrivers.filter((d) => d.contribution < -0.05).slice(0, 3)}
                streak={streak}
                onNext={nextRound}
              />
            ) : (
              <CandidateCard
                candidates={candidateNames}
                pick={pickName}
                signGuess={signGuess}
                value={pickValue}
                movesLeft={movesLeft}
                topDrivers={allDrivers.slice(0, 4)}
                onPick={setPickName}
                onSignGuess={setSignGuess}
                onLockIn={lockIn}
              />
            )}
          </div>

          <div className="lg:col-span-7">
            <LeverBoard
              world={world}
              baseWorld={scenario.world}
              movesLeft={movesLeft}
              disabled={revealed || movesLeft <= 0 || !pickName}
              notice={!pickName ? "Read the levers, then pick a sector to unlock your nudges." : undefined}
              onNudge={nudge}
            />
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-12">
          <div className="lg:col-span-7">
            {revealed ? (
              <Leaderboard ranked={ranked} candidates={candidateNames} pick={pickName} />
            ) : (
              <div className="surface-plate piece-lg flex h-full min-h-40 flex-col items-center justify-center rounded-xl p-6 text-center">
                <p className="font-mono text-sm font-extrabold uppercase tracking-wide">
                  Sector leaderboard sealed
                </p>
                <p className="mt-1.5 max-w-sm text-xs text-muted-foreground">
                  All 25 sector scores stay face down until you lock in your answer. No peeking.
                </p>
              </div>
            )}
          </div>

          <div className="lg:col-span-5">
            <h3 className="mb-2 font-mono text-sm font-extrabold uppercase tracking-wide">
              How to read a world
            </h3>
            <div className="surface-lacquer piece-lg rounded-xl p-4">
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-primary-foreground/55">
                {picked ? "Live causal read" : "The rules"}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-primary-foreground/90">
                {picked
                  ? lesson
                  : "Each lever sits somewhere between two poles. Sectors care about different levers, and slow levers only bite over a longer horizon — so the same world can reward opposite bets at 3 and 10 years."}
              </p>
              <p className="mt-3 text-[11px] leading-relaxed text-primary-foreground/50">
                Right sector: 2 points. Right tailwind/headwind call: 1 more. Fast levers shape the 3
                year view, slow ones only bite by year 10. The index runs &minus;50 to +50.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
