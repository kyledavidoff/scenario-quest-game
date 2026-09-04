# Tailwinds — "Guess the Future" variant

Swap the core loop from *nudge levers to help your champion* to *read a dealt world and predict which sector it rewards*. Same model, same art direction, new game.

## How a round plays

```text
1. DEAL    A world card is dealt (e.g. "Heat Wave", 10-year view)
           with 3 candidate sectors, e.g.  [ Grid-scale storage ]
                                            [ Cement & concrete ]
                                            [ Water & desalination ]
2. GUESS   You pick which sector this world gives the strongest
           tailwind. Optional: predict your sector's sign too
           (tailwind/headwind) for a bonus.
3. NUDGE   You get 2 (not 5) lever nudges to make your chosen
           sector win — cheaper, since guessing is the main act.
4. REVEAL  Scores shown for all 3 candidates. Win if your pick
           ranks first among them. Streak, grade, and the
           plain-language "why it moved" lesson.
```

## What changes vs the current build

- **ChampionCard → CandidateCard**: three sector chips to pick from instead of one locked champion; selected pick is highlighted, live index shown only for your pick (keeps the guess honest — the other two stay hidden until reveal).
- **Moves**: `MOVES_PER_ROUND` becomes 2; nudges only apply after you've locked a pick.
- **RevealPanel**: shows all three candidates' scores ranked, a win/miss call, your streak, and the existing causal lesson for your pick.
- **Dealing**: `dealRound` deals scenario + horizon + 3 distinct random sectors (fixed `OPENING_ROUND` stays deterministic for hydration).
- **Scoring**: win = pick ranks #1 among the 3; bonus if the sign prediction was right. Streak carries across rounds as today.
- **Leaderboard** stays (context for the whole world) but your 3 candidates are highlighted.

## What does not change

- `src/lib/tailwinds.ts` (levers, sectors, weights, horizons, scoring) — untouched.
- Board-game-warm design system, fonts, colors, card utilities.
- Single-file game state in `src/routes/index.tsx`.

## Files

- Edit: `src/routes/index.tsx` — new round shape `{ scenario, horizon, candidates[3], pick }`, win logic.
- Edit: `src/components/game/ChampionCard.tsx` → candidate picker (or new `CandidateCard.tsx`).
- Edit: `src/components/game/RevealPanel.tsx` — three-way reveal, win/miss grade.
- Edit: `src/components/game/LeverBoard.tsx` — minor: disabled until pick locked.
- Edit: `src/components/game/Leaderboard.tsx` — highlight candidate rows.

## Verification

Playwright pass: load (no hydration errors), lock a pick, nudge twice, reveal, confirm win/miss + lesson render, deal next round, screenshot both states.
