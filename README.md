# Scenario Quest

**Play it here: https://scenario-quest.vercel.app/**

A short guessing game about technology and the future.

The game deals you a hypothetical world. You read it, then you pick the three technology sectors you
think that world rewards most. The game scores you, shows the real answer, and explains why each
sector moved.

A round takes about a minute. There are 14 worlds and 25 sectors, so no two rounds feel the same.

---

## How to play

**1. You get a world.**

A dark card at the top deals you one of 14 hypothetical futures. It gives you four things:

- **The name and the one line.** For example, REARMAMENT: "Blocs harden, defense budgets swell,
  capital gets expensive."
- **The premise.** Three or four sentences on how this world got here and what it feels like to
  live in.
- **What you would see.** Three concrete things you would observe if the world were real. Defense
  budgets pass 5% of GDP. Export licenses cover machine tools. Munitions plants miss delivery dates.
- **Forces in play.** The levers that are actually moving in this world, and which way each one
  points. Great-power conflict at shooting war. Cost of capital at high real rates.

**2. You get a time horizon.**

Look at the badge in the top right of the world card. It says 3 YEAR, 5 YEAR or 10 YEAR.

This is the hard part of the game. The same world rewards different sectors at different horizons.
Read the horizon before you pick anything.

**3. You pick three sectors.**

Choose from the 25 buttons below the world card. Hover any sector to see one line on what it
actually sells. Your picks are numbered 1, 2 and 3 in the order you tap them, but the order does not
affect your score.

**4. You submit and see the answer.**

The game shows the true top three for that world at that horizon, each with a number and a reason.
Then it shows your own three picks, where each one ranked out of 25, and why it moved.

**5. You deal a new world.**

Your score carries across rounds.

---

## How scoring works

You get one point for each of your three picks that lands in the true top three.

Order does not matter. Three correct sectors in any order is a perfect round.

The header keeps a running total, like SCORE 7/12. That means you played four rounds and got 7 of a
possible 12.

---

## How to read the answer

Each sector shows a number from -50 to +50.

- **A positive number is a tailwind.** It shows in teal. The world helps that sector.
- **A negative number is a headwind.** It shows in tomato red. The world hurts that sector.
- **Near zero means the world does not care** about that sector either way.

The number is a ranking score, not a forecast. +18 does not mean 18% growth. It means this world
helps that sector more than it helps most of the other 24.

Real worlds usually land inside plus or minus 25. No plausible future pushes every force the same
direction, so nothing pins the scale.

Under each sector you get two lines. The grey line says what the sector sells. The darker line says
why it moved. That reason names the decisive force, explains the mechanism, and then names the
strongest thing working against it.

---

## How to get good at it

Three habits will move your score fast.

**Read the horizon first.**

Some forces hit quickly and then fade. Others take a decade to bite. The game sorts every force into
fast, medium and slow.

| Force speed | Examples                                                | Bites by |
| ----------- | ------------------------------------------------------- | -------- |
| fast        | Cost of capital, AI capability, trade regime            | year 3   |
| medium      | Great-power conflict, energy price, institutional trust | year 5   |
| slow        | Demographics, climate shocks, biotech access            | year 10  |

HEAT WAVE is the clearest lesson. Climate shocks are set hard in that world. At 3 years the winner
is private security, because the shocks have barely started and only fast reactions pay. At 10 years
the winner is climate adaptation and water, because by then the shocks have done their full work.

If you see a slow force driving a world, and the badge says 3 YEAR, do not pick the obvious sector.
It has not happened yet.

**Read the forces list, not the vibe.**

The world card names the levers that are moving and which way they point. That list is the answer
key in disguise. A world with "State fiscal capacity: broke" will not fund anything that needs a
government customer, no matter how urgent the problem sounds.

**Look for the counterweight.**

Most sectors have a force working against them. Nuclear fission wants a solvent state and expensive
energy. It does not want expensive capital. A world can hand it two of those and take away the
third. That is usually why an obvious pick underperforms.

---

## The worlds

Fourteen futures. Some are grim, some are good, and one is deliberately boring.

| World            | The one line                                                               |
| ---------------- | -------------------------------------------------------------------------- |
| REARMAMENT       | Blocs harden, defense budgets swell, capital gets expensive.               |
| ABUNDANCE        | Cheap energy, compounding AI, solvent states that still build.             |
| LONG STAGNATION  | Dear money, aging populations, tired institutions, no plateau broken.      |
| AI LOCKDOWN      | Capability races ahead, then the state licenses who may hold it.           |
| HEAT WAVE        | Climate shocks arrive on a quarterly cadence. Everything adapts or drowns. |
| THE UNRAVELING   | Trust collapses at home. Legitimacy, not capital, is the scarce input.     |
| OPEN WEIGHTS     | Frontier capability leaks, then publishing it becomes normal.              |
| THE GREY WAVE    | The demographic bill arrives. Workers are the scarce input.                |
| STRAIT CRISIS    | Advanced chip supply stops overnight. Everyone builds their own.           |
| FORTRESS BORDERS | Climate and demography push people. Rich countries choose walls.           |
| SOFT LANDING     | The boring good outcome, and the one fewest people price.                  |
| GENOME UNBOUND   | Biological design gets cheap. Discovery and risk arrive together.          |
| POWER CRUNCH     | AI demand outruns the grid. Megawatts, not chips, are the constraint.      |
| COLD BLOCS       | Decoupling completes without a war. Two stacks, twice the cost.            |

<details>
<summary><b>Spoilers: the winner in every world, at every horizon</b></summary>

Open this only if you want to check the model rather than play against it.

| World            | 3 yr winner                            | 5 yr winner                         | 10 yr winner                        |
| ---------------- | -------------------------------------- | ----------------------------------- | ----------------------------------- |
| REARMAMENT       | Logistics & supply-chain software      | Logistics & supply-chain software   | Autonomous weapons & counter-drone  |
| ABUNDANCE        | Consumer software & apps               | Frontier AI labs & large models     | Frontier AI labs & large models     |
| LONG STAGNATION  | Parallel financial rails               | Parallel financial rails            | Parallel financial rails            |
| AI LOCKDOWN      | AI audit, eval & compliance tooling    | AI audit, eval & compliance tooling | AI audit, eval & compliance tooling |
| HEAT WAVE        | Private security & physical resilience | Energy efficiency & demand response | Climate adaptation & water          |
| THE UNRAVELING   | Private security & physical resilience | Parallel financial rails            | Parallel financial rails            |
| OPEN WEIGHTS     | Edge & open-weight small models        | Edge & open-weight small models     | Edge & open-weight small models     |
| THE GREY WAVE    | Parallel financial rails               | Industrial robotics & automation    | Industrial robotics & automation    |
| STRAIT CRISIS    | Logistics & supply-chain software      | Autonomous weapons & counter-drone  | Autonomous weapons & counter-drone  |
| FORTRESS BORDERS | Parallel financial rails               | Parallel financial rails            | Climate adaptation & water          |
| SOFT LANDING     | Consumer software & apps               | Consumer software & apps            | Consumer software & apps            |
| GENOME UNBOUND   | Frontier AI labs & large models        | Content provenance & authentication | Biosecurity & pathogen detection    |
| POWER CRUNCH     | Enterprise AI & workflow automation    | Energy efficiency & demand response | Energy efficiency & demand response |
| COLD BLOCS       | Logistics & supply-chain software      | Logistics & supply-chain software   | Domestic fabs & semiconductor tools |

</details>

---

## The sectors

Twenty five, grouped here for reading. In the game they appear as one grid.

**Defense and security.** Autonomous weapons & counter-drone. Cybersecurity & hardened comms. Space
launch & orbital assets. Private security & physical resilience. Surveillance & identity
verification. Border & migration technology.

**AI and compute.** Frontier AI labs & large models. Edge & open-weight small models. AI audit, eval
& compliance tooling. Enterprise AI & workflow automation. Domestic fabs & semiconductor tools.
Content provenance & authentication.

**Energy and industry.** Nuclear fission & SMRs. Grid, storage & transmission. Energy efficiency &
demand response. Fusion & deep-tech moonshots. Industrial robotics & automation. Logistics &
supply-chain software.

**Climate and biology.** Climate adaptation & water. Resilient agriculture & food tech. Insurance &
catastrophe modeling. Biosecurity & pathogen detection. Longevity & care technology.

**Everything else.** Consumer software & apps. Parallel financial rails.

---

## What the numbers mean, and what they do not

The model is editorial judgment. Nobody fitted it to data, and it forecasts nothing.

It answers one question. Does this world help or hurt this sector, relative to the other 24?

It is not a market size, a revenue estimate or a price target. Do not trade on it.

The value is the reasoning, not the number. A player who learns that a hard climate world pays
private security first and sea walls later has learned something true about how slow variables work.

---

## Under the hood

Everything the game knows lives in one file: `src/lib/tailwinds.ts`. It is data plus pure functions.
No server, no database, no API key, and no network calls at runtime.

### A world is 15 numbers

Each force is a lever from 0 to 100, where 50 is the midpoint.

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

### A sector is a set of weights

Each sector carries a weight for every lever it cares about. A positive weight means the sector
gains as that lever moves toward its high pole. A negative weight means it loses.

`Nuclear fission & SMRs` carries `fiscal: 0.8, energy: 0.7, capital: -0.6, climate: 0.4,
conflict: 0.3, trade: 0.2`. It wants a solvent state and expensive energy. It does not want
expensive capital.

### The horizon multiplier

A lever only counts as much as it has bitten by that year.

| Lever speed | 3 yr | 5 yr | 10 yr |
| ----------- | ---- | ---- | ----- |
| fast        | 1.00 | 0.80 | 0.45  |
| medium      | 0.40 | 1.00 | 0.85  |
| slow        | 0.12 | 0.45 | 1.00  |

### The formula

```
deviation    = (leverValue - 50) / 50                    // -1 to +1
contribution = weight x deviation x MULT[speed][horizon]
index        = 50 x sum(contribution) / sum(|weight|)    // clamped to -50 .. +50
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

### Where the reasons come from

The game never writes prose by hand about a result. It assembles every explanation from the same
numbers that produced the ranking. Change a weight and the words follow. The text and the score can
never disagree.

- **`LEVER_EFFECT`** holds one plain English sentence for each end of each lever. The high end of
  Energy price reads "Energy is scarce and expensive, so both efficiency and new supply get paid."
- **`explain(tech, world, horizon)`** ranks a sector's drivers, names the decisive one in a
  headline, then builds the body from the two strongest lifts and the strongest counterweight. If a
  slow lever is a major driver, it says whether that lever has landed yet.
- **`readWorld(world, horizon)`** describes the world itself. The world card uses two of its
  fields: the forces in play, and the levers that are set but have not landed at this horizon.

`readWorld()` also returns the sectors a world funds, the ones it starves, and any internal tensions
from the `TENSIONS` rule list. Nothing renders those three today. They stay in the model because
they are cheap to compute and useful for a future summary panel or study mode.

---

## For developers

Built with TanStack Start on React 19, Vite, and Tailwind CSS v4. It builds to a static site.

```sh
npm i
npm run dev
```

| Path                          | What it holds                                                           |
| ----------------------------- | ----------------------------------------------------------------------- |
| `src/lib/tailwinds.ts`        | The whole model. Levers, sectors, scenarios, scoring, explanations.     |
| `src/routes/index.tsx`        | The game. One component, three phases: intro, playing, revealed.        |
| `src/routes/__root.tsx`       | The HTML shell, fonts and error boundaries.                             |
| `src/styles.css`              | The design system. Colors, surfaces and the pressable button behaviour. |
| `src/components/ui/`          | shadcn/ui components. The game screen does not use them today.          |
| `public/scenario-matrix.html` | A frozen copy of the original slider tool. See below.                   |

State is four `useState` hooks in `src/routes/index.tsx`. There is no store and no router state. The
opening round is fixed so the server and the client render the same HTML on first paint.

### The design system

`src/styles.css` defines the look as tokens and utilities. Do not hardcode a color in a component.

- `--tailwind` is teal and means a sector gains.
- `--headwind` is tomato and means a sector loses.
- `surface-plate` and `surface-lacquer` are the two card faces.
- `piece`, `piece-lg` and `piece-xl` give the hard offset shadow that makes a panel read as stacked
  cardboard.
- `pressable` sinks a button into the board on click.

### Add a world

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

Nothing else changes. The game picks it up on the next deal. Every explanation, ranking and tension
check works on it immediately.

### Add a sector

Add one entry to `TECHS`. Give it a `name`, a `what` line, and a weight for each lever it cares
about. Weights run roughly -1.0 to +1.0. Use 1.0 only for the single lever that defines the sector.

### Retune the model

- Change a weight in `TECHS` to change how a sector responds.
- Change `MULT` to change how much the horizon matters.
- Change a sentence in `LEVER_EFFECT` to change how the game explains that lever everywhere at once.

After any edit, run `npx tsc --noEmit` and `npm run build`.

### Commands

| Command            | What it does                          |
| ------------------ | ------------------------------------- |
| `npm run dev`      | Start the dev server with hot reload. |
| `npm run build`    | Build for production into `.output`.  |
| `npm run preview`  | Serve the production build locally.   |
| `npm run lint`     | Run ESLint and Prettier checks.       |
| `npm run format`   | Rewrite files with Prettier.          |
| `npx tsc --noEmit` | Typecheck without emitting files.     |

### Deploying

Import the repository on Vercel and accept the defaults. The build command is `npm run build` and
the framework preset is Vite. No environment variables are needed.

---

## The archived tool

This game grew out of a single page tool called Technology Development Scenarios. That tool gave you
15 sliders and a live bar chart of all 25 sectors. It was useful for exploring, but it was not a
game.

A frozen copy sits at `public/scenario-matrix.html`. It is served at
https://scenario-quest.vercel.app/scenario-matrix.html. It is self contained, with no build step and
no dependencies.

Treat it as an archive. It carries its own copy of the model from the day it was frozen, and it will
drift from `src/lib/tailwinds.ts` as the game changes. `src/lib/tailwinds.ts` is the live model.

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
