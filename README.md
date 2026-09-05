# Scenario Quest

A short guessing game about technology and the future.

The game deals you a hypothetical world and a time horizon. You read the world, then you pick the
three technology sectors you think it rewards most. The game scores you, shows the real answer, and
explains why each sector moved.

There are 14 worlds, 25 sectors and 3 horizons. A world can reward opposite bets at 3 years and at
10 years, so the horizon is part of the puzzle.

---

## Play it

The app is a static site. It builds to plain HTML, CSS and JavaScript, and it makes no network
calls at runtime.

Live URL: _add your Vercel link here after the first deploy._

To run it on your machine:

```sh
npm i
npm run dev
```

Then open the URL that Vite prints.

To deploy on Vercel, import this repository and accept the defaults. The build command is
`npm run build` and the framework preset is Vite. No environment variables are needed.

---

## How a round works

1. **You get a world.** A card shows the world name, a one line summary, a short premise, three
   things you would observe if the world were real, and the forces in play at your horizon.
2. **You pick three sectors** out of 25. Hover a sector to see one line on what it sells.
3. **You submit.** The game scores your picks against the model, shows the true top three with the
   reason each one won, and gives your own three picks the same treatment.
4. **You deal a new world** and keep a running score.

Scoring is one point for each of your three picks that lands in the true top three.

---

## The model

Everything the game knows lives in one file: `src/lib/tailwinds.ts`. It is pure data plus pure
functions. There is no server, no database and no API key.

### Levers

A world is 15 numbers. Each number is a lever from 0 to 100, where 50 is the midpoint. Each lever
has a low pole and a high pole, and a speed.

| Lever                    | 0                  | 100                | Speed  |
| ------------------------ | ------------------ | ------------------ | ------ |
| Cost of capital          | Free money         | High real rates    | fast   |
| Domestic political order | Stable             | Contested          | fast   |
| AI capability slope      | Clear plateau      | Fast compounding   | fast   |
| AI governance            | Open weights       | State-licensed     | fast   |
| Trade regime             | Open global        | Hard blocs         | fast   |
| Great-power conflict     | Cold peace         | Shooting war       | medium |
| US foreign posture       | Full retreat       | Max intervention   | medium |
| State fiscal capacity    | Broke              | Solvent, funding   | medium |
| Energy price             | Cheap, abundant    | Scarce, expensive  | medium |
| Labor balance            | Worker shortage    | Automation surplus | medium |
| Institutional trust      | High trust         | Collapsed trust    | medium |
| China stress             | Strong, confident  | Stagnation, crisis | slow   |
| Demographic pressure     | Young, growing     | Steep aging        | slow   |
| Climate shock rate       | Gradual            | Frequent, severe   | slow   |
| Biotech access           | Tightly controlled | Cheap, open        | slow   |

Speed is not how big a lever is. Speed is how fast it bites.

### Sectors

There are 25 technology sectors. Each one carries a weight for every lever it cares about. A
positive weight means the sector gains as that lever moves toward its high pole. A negative weight
means the sector loses.

For example, `Nuclear fission & SMRs` carries `fiscal: 0.8, energy: 0.7, capital: -0.6,
climate: 0.4, conflict: 0.3, trade: 0.2`. It wants a solvent state and expensive energy. It does
not want expensive capital.

Every sector also carries a `what` field. That is the one line the game shows to say what the
sector actually sells.

### Horizons and the speed multiplier

The horizon is what makes the game hard. A lever only counts as much as it has bitten by that year.

| Lever speed | 3 yr | 5 yr | 10 yr |
| ----------- | ---- | ---- | ----- |
| fast        | 1.00 | 0.80 | 0.45  |
| medium      | 0.40 | 1.00 | 0.85  |
| slow        | 0.12 | 0.45 | 1.00  |

Fast levers dominate the 3 year view and fade by year 10. Slow levers barely register at 3 years
and peak at 10. That is why `HEAT WAVE` rewards private security at 3 years and climate adaptation
at 10 years. The climate lever is set hard in both cases. It has simply not landed yet at 3 years.

### The formula

For one sector, in one world, at one horizon:

```
deviation    = (leverValue - 50) / 50            // -1 to +1
contribution = weight x deviation x MULT[speed][horizon]
index        = 50 x sum(contribution) / sum(|weight|)   // clamped to -50 .. +50
```

The divisor is the raw sum of absolute weights. It is not scaled by the horizon multiplier. That
choice is what preserves the horizon effect. A sector driven only by slow levers must score near
zero at 3 years, not full scale.

Dividing by the sum of absolute weights also keeps a sector with six drivers comparable to a sector
with three.

### A worked example

`Autonomous weapons & counter-drone` in `REARMAMENT` at 5 years:

| Lever                 | Weight | World value | Deviation | Speed  | Multiplier | Contribution |
| --------------------- | ------ | ----------- | --------- | ------ | ---------- | ------------ |
| Great-power conflict  | 1.0    | 80          | +0.60     | medium | 1.00       | +0.600       |
| US foreign posture    | 0.8    | 75          | +0.50     | medium | 1.00       | +0.400       |
| State fiscal capacity | 0.4    | 40          | -0.20     | medium | 1.00       | -0.080       |
| China stress          | 0.3    | 65          | +0.30     | slow   | 0.45       | +0.041       |
| Trade regime          | 0.3    | 85          | +0.70     | fast   | 0.80       | +0.168       |
| Cost of capital       | -0.2   | 70          | +0.40     | fast   | 0.80       | -0.064       |

Sum of contributions is 1.0645. Sum of absolute weights is 3.0. The index is
`50 x 1.0645 / 3.0 = +17.7`, which the game rounds to **+18**.

---

## The explanation layer

The game never writes prose by hand about a result. It assembles every explanation from the same
numbers that produced the ranking. Change a weight and the words follow automatically. The text and
the score can therefore never disagree.

Three pieces do this work, all in `src/lib/tailwinds.ts`:

- **`LEVER_EFFECT`** holds one plain English sentence for each end of each lever. For example, the
  high end of Energy price reads "Energy is scarce and expensive, so both efficiency and new supply
  get paid."
- **`explain(tech, world, horizon)`** ranks the sector's drivers by contribution, names the
  decisive one in a headline, then builds a body from the two strongest lifts and the strongest
  counterweight. If a slow lever is a major driver, it adds a note saying whether that lever has
  landed yet.
- **`readWorld(world, horizon)`** describes the world itself. The world card uses two of its
  fields: the loudest forces in play, and the levers that are set but have not landed at this
  horizon.

`readWorld()` also returns the four sectors a world funds, the four it starves, and any internal
tensions from the `TENSIONS` rule list. Nothing renders those three today. They stay in the model
because they are cheap to compute and useful if you ever want a summary panel or a study mode.

---

## Scenarios

Each scenario is a named world plus a story. A scenario carries five things: a name, a one line
blurb, a premise of three or four sentences, three concrete signals you would observe, and the 15
lever values.

The lever values are the only part the math reads. The blurb, premise and signals exist so the
player can reason about the world instead of guessing at random.

| World            | The one line                                                          | 3 yr winner                            | 5 yr winner                         | 10 yr winner                        |
| ---------------- | --------------------------------------------------------------------- | -------------------------------------- | ----------------------------------- | ----------------------------------- |
| REARMAMENT       | Blocs harden, defense budgets swell, capital gets expensive.          | Logistics & supply-chain software      | Logistics & supply-chain software   | Autonomous weapons & counter-drone  |
| ABUNDANCE        | Cheap energy, compounding AI, solvent states that still build.        | Consumer software & apps               | Frontier AI labs & large models     | Frontier AI labs & large models     |
| LONG STAGNATION  | Dear money, aging populations, tired institutions, no plateau broken. | Parallel financial rails               | Parallel financial rails            | Parallel financial rails            |
| AI LOCKDOWN      | Capability races ahead, then the state licenses who may hold it.      | AI audit, eval & compliance tooling    | AI audit, eval & compliance tooling | AI audit, eval & compliance tooling |
| HEAT WAVE        | Climate shocks arrive on a quarterly cadence.                         | Private security & physical resilience | Energy efficiency & demand response | Climate adaptation & water          |
| THE UNRAVELING   | Trust collapses at home. Legitimacy is the scarce input.              | Private security & physical resilience | Parallel financial rails            | Parallel financial rails            |
| OPEN WEIGHTS     | Frontier capability leaks, then publishing it becomes normal.         | Edge & open-weight small models        | Edge & open-weight small models     | Edge & open-weight small models     |
| THE GREY WAVE    | The demographic bill arrives. Workers are the scarce input.           | Parallel financial rails               | Industrial robotics & automation    | Industrial robotics & automation    |
| STRAIT CRISIS    | Advanced chip supply stops overnight. Everyone builds their own.      | Logistics & supply-chain software      | Autonomous weapons & counter-drone  | Autonomous weapons & counter-drone  |
| FORTRESS BORDERS | Climate and demography push people. Rich countries choose walls.      | Parallel financial rails               | Parallel financial rails            | Climate adaptation & water          |
| SOFT LANDING     | The boring good outcome, and the one fewest people price.             | Consumer software & apps               | Consumer software & apps            | Consumer software & apps            |
| GENOME UNBOUND   | Biological design gets cheap. Discovery and risk arrive together.     | Frontier AI labs & large models        | Content provenance & authentication | Biosecurity & pathogen detection    |
| POWER CRUNCH     | AI demand outruns the grid. Megawatts are the constraint.             | Enterprise AI & workflow automation    | Energy efficiency & demand response | Energy efficiency & demand response |
| COLD BLOCS       | Decoupling completes without a war. Two stacks, twice the cost.       | Logistics & supply-chain software      | Logistics & supply-chain software   | Domestic fabs & semiconductor tools |

Read that table as a spoiler list. It is here so you can check the model, not so you can win.

---

## How the code is laid out

The app is a TanStack Start project on React 19, built by Vite and styled with Tailwind CSS v4.

| Path                          | What it holds                                                           |
| ----------------------------- | ----------------------------------------------------------------------- |
| `src/lib/tailwinds.ts`        | The whole model. Levers, sectors, scenarios, scoring, explanations.     |
| `src/routes/index.tsx`        | The game itself. One component, three phases: intro, playing, revealed. |
| `src/routes/__root.tsx`       | The HTML shell, fonts and error boundaries.                             |
| `src/styles.css`              | The design system. Colors, surfaces and the pressable button behaviour. |
| `src/components/ui/`          | shadcn/ui components. The game screen does not use them today.          |
| `public/scenario-matrix.html` | A frozen copy of the original slider tool. See below.                   |

State is four `useState` hooks in `src/routes/index.tsx`. There is no store and no router state. The
opening round is fixed so that the server and the client render the same HTML on first paint.

### The design system

`src/styles.css` defines the look as a set of tokens and utilities. Do not hardcode a color in a
component. Use the tokens.

- `--tailwind` is teal and means a sector gains.
- `--headwind` is tomato and means a sector loses.
- `surface-plate` and `surface-lacquer` are the two card faces.
- `piece`, `piece-lg` and `piece-xl` give the hard offset shadow that makes a panel read as
  stacked cardboard.
- `pressable` sinks a button into the board on click.

---

## Editing the game

### Add a scenario

Add one entry to `SCENARIOS` in `src/lib/tailwinds.ts`. Only the levers you name need values. The
`w()` helper fills the rest with 50.

```ts
{
  id: "myworld",
  name: "MY WORLD",
  blurb: "One line the player reads first.",
  premise: "Three or four sentences on how this world got here.",
  signals: ["A thing you would see.", "Another one.", "A third."],
  world: w({ energy: 80, capital: 30, aislope: 70 }),
},
```

Nothing else changes. The game picks it up on the next deal, and every explanation, ranking and
tension check works on it immediately.

### Add a sector

Add one entry to `TECHS`. Give it a `name`, a `what` line, and a weight for each lever it cares
about. Weights are roughly -1.0 to +1.0. Use 1.0 only for the single lever that defines the sector.

### Retune the model

- Change a weight in `TECHS` to change how a sector responds.
- Change `MULT` to change how much the horizon matters.
- Change a sentence in `LEVER_EFFECT` to change how the game explains that lever everywhere at once.

After any edit, run `npx tsc --noEmit` and `npm run build`.

---

## What the numbers mean, and what they do not

The weights are editorial judgment. They are not measured data, and no forecast was fitted to
anything.

The index answers one question: does this world help or hurt this sector, relative to the other 24?
It is not a market size, a revenue estimate or a price target. Real worlds usually land inside plus
or minus 25, because no plausible world pushes every lever the same direction.

The value of the game is the reasoning, not the number. A player who learns that a hard climate
world pays private security first and sea walls later has learned something true about how slow
variables work.

---

## The archived tool

This game grew out of a single page tool called Technology Development Scenarios. That tool gave you
15 sliders and a live bar chart of all 25 sectors. It was useful for exploring, but it was not a
game.

A frozen copy sits at `public/scenario-matrix.html`. It is served at `/scenario-matrix.html` on any
deploy of this repository. It is self contained, with no build step and no dependencies.

Treat it as an archive. It carries its own copy of the model from the day it was frozen, and it will
drift from `src/lib/tailwinds.ts` as the game changes. `src/lib/tailwinds.ts` is the live model.

---

## Commands

| Command            | What it does                          |
| ------------------ | ------------------------------------- |
| `npm run dev`      | Start the dev server with hot reload. |
| `npm run build`    | Build for production into `.output`.  |
| `npm run preview`  | Serve the production build locally.   |
| `npm run lint`     | Run ESLint and Prettier checks.       |
| `npm run format`   | Rewrite files with Prettier.          |
| `npx tsc --noEmit` | Typecheck without emitting files.     |

---

<!-- LOVABLE:BEGIN -->

> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

<!-- LOVABLE:END -->
