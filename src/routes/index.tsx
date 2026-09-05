import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useMemo, useState } from "react";

import logo from "../assets/logo.png";

import {
  explain,
  fmt,
  HORIZON_LABEL,
  rankAll,
  readWorld,
  SCENARIOS,
  TECHS,
  type Horizon,
  type ScenarioCard,
  type Tech,
} from "@/lib/tailwinds";

const TITLE = "Scenario Quest — guess which technologies a world rewards";
const DESCRIPTION =
  "A quick scenario guessing game. You are dealt a hypothetical world and a time horizon. Pick the three technologies it rewards most, then see the answer and why.";

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

const PICKS = 3;
const HORIZONS: Horizon[] = [3, 5, 10];

type Round = { scenario: ScenarioCard; horizon: Horizon };
type Phase = "intro" | "playing" | "revealed";

function pick<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)]!;
}

function techByName(name: string): Tech {
  return TECHS.find((t) => t.name === name) ?? TECHS[0]!;
}

/** Fixed opening round so server and client render identical HTML. */
const OPENING_ROUND: Round = { scenario: SCENARIOS[0]!, horizon: 5 };

function dealRound(previous: Round): Round {
  let scenario = pick(SCENARIOS);
  let guard = 0;
  while (scenario.id === previous.scenario.id && guard++ < 12) scenario = pick(SCENARIOS);
  return { scenario, horizon: pick(HORIZONS) };
}

/** A plain-language read of what the world is doing to one sector. */
function buildLesson(tech: Tech, round: Round): string {
  const e = explain(tech, round.scenario.world, round.horizon);
  return `${e.headline} ${e.body}`.trim();
}

function TailwindsGame() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [round, setRound] = useState<Round>(OPENING_ROUND);
  const [picks, setPicks] = useState<string[]>([]);
  const [scoreTotal, setScoreTotal] = useState(0);
  const [roundsPlayed, setRoundsPlayed] = useState(0);

  const { scenario, horizon } = round;

  const reading = useMemo(() => readWorld(scenario.world, horizon), [scenario, horizon]);

  const ranked = useMemo(
    () => (phase === "revealed" ? rankAll(scenario.world, horizon) : []),
    [phase, scenario, horizon],
  );
  const actualTop = ranked.slice(0, PICKS);
  const hits = actualTop.filter((r) => picks.includes(r.name));

  const start = useCallback(() => {
    setPhase("playing");
    setPicks([]);
  }, []);

  const togglePick = useCallback(
    (name: string) => {
      if (phase !== "playing") return;
      setPicks((prev) =>
        prev.includes(name)
          ? prev.filter((p) => p !== name)
          : prev.length < PICKS
            ? [...prev, name]
            : prev,
      );
    },
    [phase],
  );

  const submit = useCallback(() => {
    if (picks.length !== PICKS) return;
    const top = rankAll(scenario.world, horizon).slice(0, PICKS);
    const earned = top.filter((r) => picks.includes(r.name)).length;
    setScoreTotal((s) => s + earned);
    setRoundsPlayed((n) => n + 1);
    setPhase("revealed");
  }, [picks, scenario, horizon]);

  const playAgain = useCallback(() => {
    setRound((prev) => dealRound(prev));
    setPicks([]);
    setPhase("playing");
  }, []);

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto flex max-w-3xl flex-col gap-5 px-4 py-8 sm:px-6">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <img
              src={logo}
              alt="Scenario Quest"
              className="size-11 shrink-0 rounded-lg border-2 border-border bg-paper object-contain p-1 shadow-[3px_3px_0_0_var(--color-border)]"
            />
            <div className="leading-none">
              <h1 className="font-mono text-2xl font-extrabold tracking-tight">SCENARIO QUEST</h1>
              <p className="mt-1 text-xs font-medium text-muted-foreground">
                guess the sectors the world rewards
              </p>
            </div>
          </div>
          {roundsPlayed > 0 && (
            <span className="surface-plate piece rounded-lg px-3 py-1.5 font-mono text-xs font-bold tracking-wide">
              SCORE {scoreTotal}/{roundsPlayed * PICKS}
            </span>
          )}
        </header>

        {phase === "intro" && (
          <section className="surface-plate piece-lg rounded-xl p-6 sm:p-8">
            <h2 className="font-mono text-xl font-extrabold tracking-tight sm:text-2xl">
              HOW TO PLAY
            </h2>
            <ol className="mt-5 grid gap-4">
              <li className="flex gap-3">
                <span className="piece grid size-7 shrink-0 place-items-center rounded-md bg-accent font-mono text-xs font-extrabold text-accent-foreground">
                  1
                </span>
                <p className="text-sm leading-relaxed text-foreground/85">
                  <strong>You are dealt a hypothetical world</strong> — a short description of where
                  the next few years might go — plus a time horizon: a 3-year, 5-year, or 10-year
                  view.
                </p>
              </li>
              <li className="flex gap-3">
                <span className="piece grid size-7 shrink-0 place-items-center rounded-md bg-accent font-mono text-xs font-extrabold text-accent-foreground">
                  2
                </span>
                <p className="text-sm leading-relaxed text-foreground/85">
                  <strong>Pick the three technologies</strong> you think benefit most in that world,
                  over that horizon. The same world can reward opposite bets at 3 and 10 years.
                </p>
              </li>
              <li className="flex gap-3">
                <span className="piece grid size-7 shrink-0 place-items-center rounded-md bg-accent font-mono text-xs font-extrabold text-accent-foreground">
                  3
                </span>
                <p className="text-sm leading-relaxed text-foreground/85">
                  <strong>Submit and see the answer.</strong> We reveal the actual top three and
                  explain, in plain language, why each one moved the way it did.
                </p>
              </li>
            </ol>
            <button
              type="button"
              onClick={start}
              className="pressable mt-7 w-full rounded-lg border-2 border-border bg-primary py-3.5 font-mono text-sm font-bold uppercase tracking-[0.15em] text-primary-foreground shadow-[4px_4px_0_0_var(--tailwind)]"
            >
              Play
            </button>
          </section>
        )}

        {phase !== "intro" && (
          <section className="surface-lacquer piece-lg rounded-xl p-5 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-primary-foreground/60">
                Your hypothetical world
              </p>
              <span className="rounded-md border border-primary-foreground/25 px-2 py-1 font-mono text-[11px] font-bold uppercase tracking-wider text-primary-foreground">
                {HORIZON_LABEL[horizon]} view
              </span>
            </div>
            <h2 className="mt-2 font-mono text-2xl font-extrabold tracking-tight text-primary-foreground sm:text-3xl">
              {scenario.name}
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-primary-foreground/85 sm:text-base">
              {scenario.blurb}
            </p>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-primary-foreground/70">
              {scenario.premise}
            </p>

            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <div>
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-primary-foreground/50">
                  What you would see
                </p>
                <ul className="mt-2 grid gap-1.5">
                  {scenario.signals.map((s) => (
                    <li
                      key={s}
                      className="flex gap-2 text-xs leading-relaxed text-primary-foreground/75"
                    >
                      <span className="mt-[6px] size-1 shrink-0 rounded-full bg-primary-foreground/40" />
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-primary-foreground/50">
                  Forces in play at {horizon} years
                </p>
                <ul className="mt-2 grid gap-1.5">
                  {reading.forces.map((f) => (
                    <li
                      key={f.leverId}
                      className="text-xs leading-relaxed text-primary-foreground/75"
                    >
                      <span className="font-mono font-bold text-primary-foreground">{f.name}</span>{" "}
                      {f.pole.toLowerCase()}
                      {f.landed !== "now" && (
                        <span className="text-primary-foreground/45">
                          {f.landed === "building" ? " · still building" : " · barely started"}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <p className="mt-4 text-xs leading-relaxed text-primary-foreground/55">
              Judged over {horizon} years. Some forces hit fast and fade; slow ones only bite by
              year 10.
              {reading.pending.length > 0 && (
                <> Set but not yet landed here: {reading.pending.join(", ").toLowerCase()}.</>
              )}
            </p>
          </section>
        )}

        {phase === "playing" && (
          <section>
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <h3 className="font-mono text-sm font-extrabold uppercase tracking-wide">
                Pick {PICKS} technologies
              </h3>
              <span className="font-mono text-xs font-bold text-muted-foreground">
                {picks.length}/{PICKS} selected
              </span>
            </div>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {TECHS.map((t) => {
                const chosen = picks.includes(t.name);
                const order = picks.indexOf(t.name);
                return (
                  <button
                    key={t.name}
                    type="button"
                    title={t.what}
                    onClick={() => togglePick(t.name)}
                    className={`pressable flex items-center justify-between gap-2 rounded-lg border-2 px-3 py-2.5 text-left ${
                      chosen
                        ? "border-tailwind bg-tailwind/15 shadow-[3px_3px_0_0_var(--tailwind)]"
                        : "surface-plate border-border"
                    }`}
                  >
                    <span className="text-[13px] font-semibold leading-tight">{t.name}</span>
                    {chosen && (
                      <span className="piece grid size-5 shrink-0 place-items-center rounded bg-tailwind font-mono text-[10px] font-extrabold text-white">
                        {order + 1}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
            <button
              type="button"
              disabled={picks.length !== PICKS}
              onClick={submit}
              className="pressable mt-5 w-full rounded-lg border-2 border-border bg-primary py-3.5 font-mono text-sm font-bold uppercase tracking-[0.15em] text-primary-foreground shadow-[4px_4px_0_0_var(--tailwind)] disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
            >
              {picks.length === PICKS ? "Submit my picks" : `Pick ${PICKS - picks.length} more`}
            </button>
          </section>
        )}

        {phase === "revealed" && (
          <section className="grid gap-5">
            <div className="surface-plate piece-lg rounded-xl p-5">
              <p className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                The answer — top {PICKS} over {horizon} years
              </p>
              <div className="mt-3 grid gap-2">
                {actualTop.map((r, i) => {
                  const youGotIt = picks.includes(r.name);
                  const tech = techByName(r.name);
                  return (
                    <div
                      key={r.name}
                      className={`piece rounded-lg px-3 py-2.5 ${
                        youGotIt ? "bg-tailwind/15" : "bg-background"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex min-w-0 items-center gap-3">
                          <span className="piece grid size-7 shrink-0 place-items-center rounded-md bg-accent font-mono text-xs font-extrabold text-accent-foreground">
                            {i + 1}
                          </span>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-bold">{r.name}</p>
                            <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                              {youGotIt ? "you called it" : "you missed it"}
                            </p>
                          </div>
                        </div>
                        <span
                          className={`tabular shrink-0 font-mono text-xl font-extrabold ${
                            r.value >= 0 ? "text-tailwind" : "text-headwind"
                          }`}
                        >
                          {fmt(r.value)}
                        </span>
                      </div>
                      <p className="mt-2 text-xs leading-relaxed text-foreground/60">{tech.what}</p>
                      <p className="mt-1.5 text-xs leading-relaxed text-foreground/80">
                        {buildLesson(tech, round)}
                      </p>
                    </div>
                  );
                })}
              </div>
              <p className="mt-4 font-mono text-sm font-extrabold uppercase tracking-wide">
                {hits.length === 3
                  ? "Clean sweep — all three."
                  : hits.length === 0
                    ? "Missed all three."
                    : `You got ${hits.length} of ${PICKS}.`}
              </p>
            </div>

            <div className="surface-plate piece-lg rounded-xl p-5">
              <p className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                How this world reads — {horizon} year view
              </p>
              <div className="mt-3 grid gap-4 sm:grid-cols-2">
                <div>
                  <h4 className="font-mono text-xs font-extrabold uppercase tracking-wide">
                    What it funds
                  </h4>
                  <ul className="mt-2 grid gap-1.5">
                    {reading.funds.length === 0 && (
                      <li className="text-xs leading-relaxed text-muted-foreground">
                        Nothing gains much at this horizon.
                      </li>
                    )}
                    {reading.funds.map((r) => (
                      <li
                        key={r.name}
                        className="flex items-baseline justify-between gap-2 text-xs leading-relaxed"
                      >
                        <span className="font-semibold">{r.name}</span>
                        <span className="tabular shrink-0 font-mono font-bold text-tailwind">
                          {fmt(r.value)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-mono text-xs font-extrabold uppercase tracking-wide">
                    What it starves
                  </h4>
                  <ul className="mt-2 grid gap-1.5">
                    {reading.starves.length === 0 && (
                      <li className="text-xs leading-relaxed text-muted-foreground">
                        Nothing is badly hurt at this horizon.
                      </li>
                    )}
                    {reading.starves.map((r) => (
                      <li
                        key={r.name}
                        className="flex items-baseline justify-between gap-2 text-xs leading-relaxed"
                      >
                        <span className="font-semibold">{r.name}</span>
                        <span className="tabular shrink-0 font-mono font-bold text-headwind">
                          {fmt(r.value)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              {reading.tensions.length > 0 && (
                <div className="mt-4 border-t-2 border-border pt-3">
                  <h4 className="font-mono text-xs font-extrabold uppercase tracking-wide">
                    Tensions in this world
                  </h4>
                  <ul className="mt-2 grid gap-1.5">
                    {reading.tensions.map((t) => (
                      <li key={t} className="text-xs leading-relaxed text-foreground/75">
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {picks.length > 0 && (
              <div className="surface-plate piece-lg rounded-xl p-5">
                <p className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                  Why your picks moved
                </p>
                <div className="mt-3 grid gap-3">
                  {picks.map((name) => {
                    const r = ranked.find((x) => x.name === name);
                    const tech = techByName(name);
                    return (
                      <div key={name} className="piece rounded-lg bg-background p-3.5">
                        <div className="flex items-baseline justify-between gap-3">
                          <p className="text-sm font-bold">{name}</p>
                          <p className="shrink-0 font-mono text-xs font-bold text-muted-foreground">
                            #{r?.rank ?? "–"}{" "}
                            <span
                              className={`tabular ${
                                (r?.value ?? 0) >= 0 ? "text-tailwind" : "text-headwind"
                              }`}
                            >
                              {fmt(r?.value ?? 0)}
                            </span>
                          </p>
                        </div>
                        <p className="mt-1.5 text-xs leading-relaxed text-foreground/60">
                          {tech.what}
                        </p>
                        <p className="mt-1.5 text-xs leading-relaxed text-foreground/80">
                          {buildLesson(tech, round)}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={playAgain}
              className="pressable w-full rounded-lg border-2 border-border bg-primary py-3.5 font-mono text-sm font-bold uppercase tracking-[0.15em] text-primary-foreground shadow-[4px_4px_0_0_var(--tailwind)]"
            >
              Deal a new world
            </button>
          </section>
        )}
      </div>
    </main>
  );
}
