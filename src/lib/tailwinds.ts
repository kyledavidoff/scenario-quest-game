/**
 * Tailwinds — scenario model.
 *
 * 15 world "levers" (0-100, 50 = midpoint) drive a signed tailwind/headwind
 * index (-50..+50) for 25 technology sectors. Weights are judgment, not data.
 */

export type Speed = "fast" | "medium" | "slow";
export type Horizon = 3 | 5 | 10;

export type Lever = {
  id: string;
  name: string;
  lo: string;
  hi: string;
  speed: Speed;
};

export const LEVERS: Lever[] = [
  { id: "capital", name: "Cost of capital", lo: "Free money", hi: "High real rates", speed: "fast" },
  { id: "order", name: "Domestic political order", lo: "Stable", hi: "Contested", speed: "fast" },
  { id: "aislope", name: "AI capability slope", lo: "Clear plateau", hi: "Fast compounding", speed: "fast" },
  { id: "aigov", name: "AI governance", lo: "Open weights", hi: "State-licensed", speed: "fast" },
  { id: "trade", name: "Trade regime", lo: "Open global", hi: "Hard blocs", speed: "fast" },
  { id: "conflict", name: "Great-power conflict", lo: "Cold peace", hi: "Shooting war", speed: "medium" },
  { id: "interv", name: "US foreign posture", lo: "Full retreat", hi: "Max intervention", speed: "medium" },
  { id: "fiscal", name: "State fiscal capacity", lo: "Broke", hi: "Solvent, funding", speed: "medium" },
  { id: "energy", name: "Energy price", lo: "Cheap, abundant", hi: "Scarce, expensive", speed: "medium" },
  { id: "labor", name: "Labor balance", lo: "Worker shortage", hi: "Automation surplus", speed: "medium" },
  { id: "trust", name: "Institutional trust", lo: "High trust", hi: "Collapsed trust", speed: "medium" },
  { id: "china", name: "China stress", lo: "Strong, confident", hi: "Stagnation, crisis", speed: "slow" },
  { id: "demog", name: "Demographic pressure", lo: "Young, growing", hi: "Steep aging", speed: "slow" },
  { id: "climate", name: "Climate shock rate", lo: "Gradual", hi: "Frequent, severe", speed: "slow" },
  { id: "bio", name: "Biotech access", lo: "Tightly controlled", hi: "Cheap, open", speed: "slow" },
];

export const LMAP: Record<string, Lever> = Object.fromEntries(LEVERS.map((l) => [l.id, l]));

export type Tech = { name: string; weights: Record<string, number> };

export const TECHS: Tech[] = [
  { name: "Autonomous weapons & counter-drone", weights: { conflict: 1.0, interv: 0.8, fiscal: 0.4, china: 0.3, trade: 0.3, capital: -0.2 } },
  { name: "Frontier AI labs & large models", weights: { aislope: 1.0, capital: -0.5, energy: -0.4, aigov: -0.3, fiscal: 0.2 } },
  { name: "Edge & open-weight small models", weights: { aigov: -0.8, energy: 0.4, aislope: 0.3, trust: 0.3, trade: 0.2 } },
  { name: "AI audit, eval & compliance tooling", weights: { aigov: 1.0, aislope: 0.5, trust: 0.3, fiscal: 0.2 } },
  { name: "Domestic fabs & semiconductor tools", weights: { trade: 1.0, conflict: 0.6, fiscal: 0.6, china: 0.4, capital: -0.3 } },
  { name: "Industrial robotics & automation", weights: { labor: -0.6, demog: 0.6, trade: 0.4, capital: -0.4, energy: -0.2 } },
  { name: "Nuclear fission & SMRs", weights: { fiscal: 0.8, energy: 0.7, capital: -0.6, climate: 0.4, conflict: 0.3, trade: 0.2 } },
  { name: "Grid, storage & transmission", weights: { energy: 0.7, climate: 0.6, fiscal: 0.6, capital: -0.4, aislope: 0.3 } },
  { name: "Fusion & deep-tech moonshots", weights: { capital: -0.9, fiscal: 0.6, energy: 0.4, order: -0.4, conflict: -0.2 } },
  { name: "Space launch & orbital assets", weights: { conflict: 0.7, fiscal: 0.6, interv: 0.5, china: 0.3, capital: -0.4 } },
  { name: "Surveillance & identity verification", weights: { order: 0.9, trust: 0.5, conflict: 0.4, aigov: 0.3, bio: 0.2 } },
  { name: "Content provenance & authentication", weights: { trust: 0.9, aislope: 0.6, order: 0.4 } },
  { name: "Cybersecurity & hardened comms", weights: { conflict: 0.8, order: 0.6, aislope: 0.5, interv: 0.4, china: 0.3 } },
  { name: "Parallel financial rails", weights: { trust: 0.9, order: 0.8, trade: 0.3, capital: 0.2 } },
  { name: "Private security & physical resilience", weights: { order: 1.0, trust: 0.5, climate: 0.4 } },
  { name: "Biosecurity & pathogen detection", weights: { bio: 1.0, conflict: 0.4, fiscal: 0.4, climate: 0.3 } },
  { name: "Longevity & care technology", weights: { demog: 0.9, capital: -0.4, bio: 0.3, labor: -0.3, fiscal: 0.3 } },
  { name: "Climate adaptation & water", weights: { climate: 1.0, fiscal: 0.4, energy: 0.3 } },
  { name: "Resilient agriculture & food tech", weights: { climate: 0.8, trade: 0.5, energy: 0.3, bio: 0.3 } },
  { name: "Insurance & catastrophe modeling", weights: { climate: 0.8, aislope: 0.4, order: 0.4, conflict: 0.3 } },
  { name: "Consumer software & apps", weights: { capital: -0.6, order: -0.5, aislope: 0.4, trade: -0.2, trust: -0.2 } },
  { name: "Enterprise AI & workflow automation", weights: { aislope: 0.8, labor: 0.3, demog: 0.3, capital: -0.3 } },
  { name: "Logistics & supply-chain software", weights: { trade: 0.8, conflict: 0.4, climate: 0.4, demog: 0.3 } },
  { name: "Energy efficiency & demand response", weights: { energy: 0.9, climate: 0.4, capital: -0.2 } },
  { name: "Border & migration technology", weights: { order: 0.6, climate: 0.5, demog: 0.5, interv: 0.3 } },
];

/** How much a lever of each speed has bitten by a given horizon. */
export const MULT: Record<Speed, Record<Horizon, number>> = {
  fast: { 3: 1.0, 5: 0.8, 10: 0.45 },
  medium: { 3: 0.4, 5: 1.0, 10: 0.85 },
  slow: { 3: 0.12, 5: 0.45, 10: 1.0 },
};

export type World = Record<string, number>;

export const NEUTRAL_WORLD: World = Object.fromEntries(LEVERS.map((l) => [l.id, 50]));

export type ScenarioCard = { id: string; name: string; blurb: string; world: World };

const w = (partial: Record<string, number>): World => ({ ...NEUTRAL_WORLD, ...partial });

export const SCENARIOS: ScenarioCard[] = [
  {
    id: "rearmament",
    name: "REARMAMENT",
    blurb: "Blocs harden, defense budgets swell, capital gets expensive.",
    world: w({ conflict: 80, interv: 75, trade: 85, fiscal: 40, capital: 70, china: 65, order: 60, aigov: 65, aislope: 60, energy: 60, trust: 65 }),
  },
  {
    id: "abundance",
    name: "ABUNDANCE",
    blurb: "Cheap energy, compounding AI, solvent states that still build.",
    world: w({ aislope: 85, energy: 15, capital: 25, fiscal: 70, trade: 20, conflict: 20, order: 25, trust: 35, labor: 70, bio: 60 }),
  },
  {
    id: "longstagnation",
    name: "LONG STAGNATION",
    blurb: "Dear money, aging populations, tired institutions, no plateau broken.",
    world: w({ capital: 80, aislope: 25, fiscal: 20, order: 65, trust: 75, trade: 65, energy: 65, demog: 75, china: 70 }),
  },
  {
    id: "lockdown",
    name: "AI LOCKDOWN",
    blurb: "Capability races ahead, then the state licenses who may hold it.",
    world: w({ aislope: 95, aigov: 90, fiscal: 65, order: 60, trust: 70, labor: 85, trade: 60 }),
  },
  {
    id: "heatwave",
    name: "HEAT WAVE",
    blurb: "Climate shocks arrive on a quarterly cadence. Everything adapts or drowns.",
    world: w({ climate: 88, energy: 70, fiscal: 55, trade: 60, order: 60, demog: 60, trust: 60 }),
  },
  {
    id: "unraveling",
    name: "THE UNRAVELING",
    blurb: "Trust collapses at home. Legitimacy, not capital, is the scarce input.",
    world: w({ order: 85, trust: 88, interv: 25, fiscal: 30, capital: 65, aigov: 30, china: 60 }),
  },
];

export const HORIZON_LABEL: Record<Horizon, string> = {
  3: "3 YEAR",
  5: "5 YEAR",
  10: "10 YEAR",
};

/** Signed index, -50..+50. */
export function score(weights: Record<string, number>, world: World, horizon: Horizon): number {
  let raw = 0;
  let denom = 0;
  for (const [id, weight] of Object.entries(weights)) {
    const lever = LMAP[id];
    if (!lever) continue;
    const dev = ((world[id] ?? 50) - 50) / 50;
    const m = MULT[lever.speed][horizon];
    raw += weight * dev * m;
    denom += Math.abs(weight) * m;
  }
  if (!denom) return 0;
  return Math.max(-50, Math.min(50, (50 * raw) / denom));
}

export type Ranked = { name: string; value: number; rank: number };

export function rankAll(world: World, horizon: Horizon): Ranked[] {
  return TECHS.map((t) => ({ name: t.name, value: score(t.weights, world, horizon) }))
    .sort((a, b) => b.value - a.value)
    .map((r, i) => ({ ...r, rank: i + 1 }));
}

export type Driver = { leverId: string; name: string; contribution: number; pole: string };

/** Which levers are doing the most work for one sector, strongest first. */
export function drivers(tech: Tech, world: World, horizon: Horizon): Driver[] {
  const out: Driver[] = [];
  for (const [id, weight] of Object.entries(tech.weights)) {
    const lever = LMAP[id];
    if (!lever) continue;
    const dev = ((world[id] ?? 50) - 50) / 50;
    out.push({
      leverId: id,
      name: lever.name,
      contribution: weight * dev * MULT[lever.speed][horizon],
      pole: (world[id] ?? 50) >= 50 ? lever.hi : lever.lo,
    });
  }
  return out.sort((a, b) => Math.abs(b.contribution) - Math.abs(a.contribution));
}

export type Grade = { label: string; note: string; tone: "win" | "mid" | "loss" };

export function grade(value: number, rank: number): Grade {
  if (rank === 1) return { label: "CLEAN SWEEP", note: "Your sector tops all 25. Nobody rode this world better.", tone: "win" };
  if (value >= 30) return { label: "STRONG BET", note: "A genuine tailwind. This world was built for your sector.", tone: "win" };
  if (value >= 12) return { label: "IN THE MONEY", note: "Real lift, but you left moves on the table.", tone: "win" };
  if (value >= -8) return { label: "FLAT", note: "The world barely noticed your sector. Push harder next round.", tone: "mid" };
  if (value >= -28) return { label: "HEADWIND", note: "You shaped a world that works against your own bet.", tone: "loss" };
  return { label: "WIPED OUT", note: "Brutal. Every lever you touched cut the wrong way.", tone: "loss" };
}

export function fmt(value: number): string {
  const rounded = Math.round(value);
  return `${rounded > 0 ? "+" : rounded < 0 ? "\u2212" : ""}${Math.abs(rounded)}`;
}
