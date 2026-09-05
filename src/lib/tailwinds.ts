/**
 * Scenario Quest — the scenario model.
 *
 * This file is the whole "back end". It is pure data plus pure functions, so
 * the game runs with no server, no database and no network calls.
 *
 * The model is a port of the Technology Development Scenarios tool
 * (tech_acceleration_scenarios/index.html), extended with the explanation
 * layer the game needs: what each sector is, what each lever does to the
 * world, what each dealt world looks like from the inside, and why a sector
 * wins or loses in it.
 *
 * Shape of the model
 * ------------------
 *   15 LEVERS       a world is 15 numbers, each 0-100, 50 = midpoint
 *   25 TECHS        each sector carries a weight per lever
 *   3 HORIZONS      3, 5 or 10 years
 *   MULT            how much a lever of a given speed has bitten by a horizon
 *
 * score() turns a world plus a horizon into a signed index from -50 to +50 for
 * one sector. Every weight is editorial judgment, not measured data. The index
 * says whether a world helps or hurts a sector. It is not a market forecast.
 */

export type Speed = "fast" | "medium" | "slow";
export type Horizon = 3 | 5 | 10;

export type Lever = {
  id: string;
  name: string;
  /** Label for the 0 end of the slider. */
  lo: string;
  /** Label for the 100 end of the slider. */
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

/**
 * What each lever actually does to the economy at each end.
 *
 * Every explanation the game shows is assembled from these sentences, so the
 * words a player reads can never disagree with the arithmetic that ranked the
 * sectors. Change a weight and the prose follows.
 */
export const LEVER_EFFECT: Record<string, { hi: string; lo: string }> = {
  capital: {
    hi: "Capital is expensive, so anything with a long payback struggles to get funded.",
    lo: "Capital is cheap, so speculative long-horizon projects find money easily.",
  },
  order: {
    hi: "Domestic politics is contested, so demand shifts toward control, security and verification.",
    lo: "Domestic politics is stable, so ordinary consumer and enterprise demand holds up.",
  },
  aislope: {
    hi: "AI capability keeps compounding, so cognition-heavy products absorb the investment and the talent.",
    lo: "AI capability has plateaued, so money rotates toward physical automation and energy.",
  },
  aigov: {
    hi: "The state licenses models and compute, so compliance becomes a required purchase.",
    lo: "Model weights stay open, so capability spreads to edge devices and small teams.",
  },
  trade: {
    hi: "Trade splits into blocs, so countries duplicate supply chains inside their own borders.",
    lo: "Trade stays open, so firms buy the cheapest input anywhere and specialize hard.",
  },
  conflict: {
    hi: "Major powers are fighting, so defense procurement sets the pace for hardware.",
    lo: "Major powers hold a cold peace, so civilian demand leads and defense budgets stay flat.",
  },
  interv: {
    hi: "The United States intervenes widely, so it funds force projection and dual-use research.",
    lo: "The United States pulls back, so allies buy their own defense and US programs shrink.",
  },
  fiscal: {
    hi: "The state can fund large programs, so capital-heavy public projects actually move.",
    lo: "The state is broke, so anything that needs a government customer stalls.",
  },
  energy: {
    hi: "Energy is scarce and expensive, so both efficiency and new supply get paid.",
    lo: "Energy is cheap, so power-hungry systems scale and efficiency plays lose urgency.",
  },
  labor: {
    hi: "Automation has created a worker surplus, so deployment meets political resistance.",
    lo: "Workers are scarce, so automation has a guaranteed buyer and a fast payback.",
  },
  trust: {
    hi: "Institutional trust has collapsed, so verification and parallel systems find real demand.",
    lo: "Institutional trust holds, so centralized systems keep their default position.",
  },
  china: {
    hi: "China is under stress, so supply chains and security assumptions both get rewritten.",
    lo: "China is strong and confident, so competition stays economic rather than disruptive.",
  },
  demog: {
    hi: "Rich countries age steeply, so care, longevity and labor substitution all grow.",
    lo: "Workforces stay young, so labor substitution faces much less urgency.",
  },
  climate: {
    hi: "Climate shocks arrive often, so adaptation and risk pricing become core spending.",
    lo: "Climate change stays gradual, so adaptation spending stays discretionary.",
  },
  bio: {
    hi: "Biological tools are cheap and open, so detection and biosecurity become large markets.",
    lo: "Biological tools stay controlled, so biosecurity demand stays narrow and state-driven.",
  },
};

export type Tech = {
  name: string;
  /** One line on what the sector actually sells, so a pick is an informed pick. */
  what: string;
  weights: Record<string, number>;
};

/**
 * Positive weight: the sector benefits as that lever moves toward its high
 * pole. Negative weight: the sector suffers as it does.
 */
export const TECHS: Tech[] = [
  {
    name: "Autonomous weapons & counter-drone",
    what: "Armed drones, loitering munitions, and the radar, jamming and interceptors built to stop them.",
    weights: { conflict: 1.0, interv: 0.8, fiscal: 0.4, china: 0.3, trade: 0.3, capital: -0.2 },
  },
  {
    name: "Frontier AI labs & large models",
    what: "The few labs training the largest models, plus the compute and data centers they run on.",
    weights: { aislope: 1.0, capital: -0.5, energy: -0.4, aigov: -0.3, fiscal: 0.2 },
  },
  {
    name: "Edge & open-weight small models",
    what: "Small models that run on a laptop, a phone or a factory device, with weights anyone can download.",
    weights: { aigov: -0.8, energy: 0.4, aislope: 0.3, trust: 0.3, trade: 0.2 },
  },
  {
    name: "AI audit, eval & compliance tooling",
    what: "Testing, red teaming, model documentation, and the audit trail a regulator asks to see.",
    weights: { aigov: 1.0, aislope: 0.5, trust: 0.3, fiscal: 0.2 },
  },
  {
    name: "Domestic fabs & semiconductor tools",
    what: "Chip plants built inside a home bloc, plus the lithography and metrology gear that fills them.",
    weights: { trade: 1.0, conflict: 0.6, fiscal: 0.6, china: 0.4, capital: -0.3 },
  },
  {
    name: "Industrial robotics & automation",
    what: "Arms, mobile robots and machine vision that replace or multiply factory and warehouse labor.",
    weights: { labor: -0.6, demog: 0.6, trade: 0.4, capital: -0.4, energy: -0.2 },
  },
  {
    name: "Nuclear fission & SMRs",
    what: "Large reactors and small modular reactors, plus fuel supply and the licensing that gates them.",
    weights: { fiscal: 0.8, energy: 0.7, capital: -0.6, climate: 0.4, conflict: 0.3, trade: 0.2 },
  },
  {
    name: "Grid, storage & transmission",
    what: "High voltage lines, batteries, transformers, and the software that keeps a stressed grid balanced.",
    weights: { energy: 0.7, climate: 0.6, fiscal: 0.6, capital: -0.4, aislope: 0.3 },
  },
  {
    name: "Fusion & deep-tech moonshots",
    what: "Fusion, quantum and novel materials. Long dated science bets with no revenue for a decade.",
    weights: { capital: -0.9, fiscal: 0.6, energy: 0.4, order: -0.4, conflict: -0.2 },
  },
  {
    name: "Space launch & orbital assets",
    what: "Rockets, satellites, earth imaging, and position, navigation and timing services.",
    weights: { conflict: 0.7, fiscal: 0.6, interv: 0.5, china: 0.3, capital: -0.4 },
  },
  {
    name: "Surveillance & identity verification",
    what: "Cameras, face and gait recognition, digital ID, and the analytics stack behind them.",
    weights: { order: 0.9, trust: 0.5, conflict: 0.4, aigov: 0.3, bio: 0.2 },
  },
  {
    name: "Content provenance & authentication",
    what: "Watermarks, signed media and the tools that prove a file is what it claims to be.",
    weights: { trust: 0.9, aislope: 0.6, order: 0.4 },
  },
  {
    name: "Cybersecurity & hardened comms",
    what: "Network defense, encrypted messaging, and systems built to keep working while under attack.",
    weights: { conflict: 0.8, order: 0.6, aislope: 0.5, interv: 0.4, china: 0.3 },
  },
  {
    name: "Parallel financial rails",
    what: "Stablecoins, private clearing and payment systems that route around the incumbent banks.",
    weights: { trust: 0.9, order: 0.8, trade: 0.3, capital: 0.2 },
  },
  {
    name: "Private security & physical resilience",
    what: "Guards, hardened sites, backup power and private response where public services stop showing up.",
    weights: { order: 1.0, trust: 0.5, climate: 0.4 },
  },
  {
    name: "Biosecurity & pathogen detection",
    what: "Wastewater and air sampling, rapid sequencing, and screening on DNA synthesis orders.",
    weights: { bio: 1.0, conflict: 0.4, fiscal: 0.4, climate: 0.3 },
  },
  {
    name: "Longevity & care technology",
    what: "Drugs and devices for aging bodies, plus technology that stretches a shrinking care workforce.",
    weights: { demog: 0.9, capital: -0.4, bio: 0.3, labor: -0.3, fiscal: 0.3 },
  },
  {
    name: "Climate adaptation & water",
    what: "Sea walls, cooling, desalination, water reuse, and the engineering that keeps places habitable.",
    weights: { climate: 1.0, fiscal: 0.4, energy: 0.3 },
  },
  {
    name: "Resilient agriculture & food tech",
    what: "Drought tolerant crops, controlled environment farming, and shorter, sturdier food chains.",
    weights: { climate: 0.8, trade: 0.5, energy: 0.3, bio: 0.3 },
  },
  {
    name: "Insurance & catastrophe modeling",
    what: "Pricing and moving physical risk: reinsurance, catastrophe bonds and the models behind them.",
    weights: { climate: 0.8, aislope: 0.4, order: 0.4, conflict: 0.3 },
  },
  {
    name: "Consumer software & apps",
    what: "Software sold to people rather than institutions, funded by cheap money and calm attention.",
    weights: { capital: -0.6, order: -0.5, aislope: 0.4, trade: -0.2, trust: -0.2 },
  },
  {
    name: "Enterprise AI & workflow automation",
    what: "Software that takes over back office work: claims, contracts, support, coding and accounting.",
    weights: { aislope: 0.8, labor: 0.3, demog: 0.3, capital: -0.3 },
  },
  {
    name: "Logistics & supply-chain software",
    what: "Routing, customs, tracking and inventory tools that keep goods moving across many borders.",
    weights: { trade: 0.8, conflict: 0.4, climate: 0.4, demog: 0.3 },
  },
  {
    name: "Energy efficiency & demand response",
    what: "Retrofits, heat pumps, industrial efficiency, and paying large users to cut load at peak.",
    weights: { energy: 0.9, climate: 0.4, capital: -0.2 },
  },
  {
    name: "Border & migration technology",
    what: "Screening, biometrics, sensing and case management at borders and inside migration systems.",
    weights: { order: 0.6, climate: 0.5, demog: 0.5, interv: 0.3 },
  },
];

/**
 * How much a lever of each speed has bitten by a given horizon.
 *
 * This is what makes the horizon matter. Fast levers dominate the 3 year view
 * and fade by year 10. Slow levers barely register at 3 years and peak at 10.
 * The same world can therefore reward opposite bets at 3 and 10 years.
 */
export const MULT: Record<Speed, Record<Horizon, number>> = {
  fast: { 3: 1.0, 5: 0.8, 10: 0.45 },
  medium: { 3: 0.4, 5: 1.0, 10: 0.85 },
  slow: { 3: 0.12, 5: 0.45, 10: 1.0 },
};

export type World = Record<string, number>;

export const NEUTRAL_WORLD: World = Object.fromEntries(LEVERS.map((l) => [l.id, 50]));

export type ScenarioCard = {
  id: string;
  name: string;
  /** One line, shown as the headline of the dealt world. */
  blurb: string;
  /** Three or four sentences on how this world got here and what it feels like. */
  premise: string;
  /** Concrete things a player would observe if this world were real. */
  signals: string[];
  world: World;
};

const w = (partial: Record<string, number>): World => ({ ...NEUTRAL_WORLD, ...partial });

export const SCENARIOS: ScenarioCard[] = [
  {
    id: "rearmament",
    name: "REARMAMENT",
    blurb: "Blocs harden, defense budgets swell, capital gets expensive.",
    premise:
      "A shooting war between major powers started and has not stopped. Every large economy now treats supply as a security question. Governments order weapons faster than industry can build them. Rates stay high because war spending is inflationary and central banks refuse to blink.",
    signals: [
      "Defense budgets pass 5% of GDP in three G7 countries.",
      "Export licenses now cover machine tools, not only chips.",
      "Munitions plants run three shifts and still miss delivery dates.",
    ],
    world: w({ conflict: 80, interv: 75, trade: 85, fiscal: 40, capital: 70, china: 65, order: 60, aigov: 65, aislope: 60, energy: 60, trust: 65 }),
  },
  {
    id: "abundance",
    name: "ABUNDANCE",
    blurb: "Cheap energy, compounding AI, solvent states that still build.",
    premise:
      "Energy got cheap and stayed cheap. AI capability keeps compounding, and the gains show up in real output rather than only in demos. Central banks cut rates because inflation fell for real reasons. Governments are solvent and still willing to build large things.",
    signals: [
      "Industrial power prices fall four years in a row.",
      "A large economy permits new generation in months, not decades.",
      "Firms report double digit productivity gains and keep hiring.",
    ],
    world: w({ aislope: 85, energy: 15, capital: 25, fiscal: 70, trade: 20, conflict: 20, order: 25, trust: 35, labor: 70, bio: 60 }),
  },
  {
    id: "longstagnation",
    name: "LONG STAGNATION",
    blurb: "Dear money, aging populations, tired institutions, no plateau broken.",
    premise:
      "Nothing breaks and nothing improves. Real rates stay high, so long dated bets cannot get funded. AI stalls below the level that would change output. Rich populations age, tax bases shrink, and states spend what is left on pensions and interest.",
    signals: [
      "Venture funding falls for six straight quarters.",
      "Model benchmarks improve by single digits per year.",
      "Public capital budgets get cut to protect entitlement payments.",
    ],
    world: w({ capital: 80, aislope: 25, fiscal: 20, order: 65, trust: 75, trade: 65, energy: 65, demog: 75, china: 70 }),
  },
  {
    id: "lockdown",
    name: "AI LOCKDOWN",
    blurb: "Capability races ahead, then the state licenses who may hold it.",
    premise:
      "Capability races ahead, and then the state takes control of who may hold it. Training runs above a compute threshold need a license. Weights above a capability line cannot be published. The models work extremely well, and only a few licensed operators may run them.",
    signals: [
      "A compute threshold becomes law in the US, EU and China inside one year.",
      "Open releases stop at the frontier and continue only well behind it.",
      "Audit and eval firms become a required line item, not an option.",
    ],
    world: w({ aislope: 95, aigov: 90, fiscal: 65, order: 60, trust: 70, labor: 85, trade: 60 }),
  },
  {
    id: "heatwave",
    name: "HEAT WAVE",
    blurb: "Climate shocks arrive on a quarterly cadence. Everything adapts or drowns.",
    premise:
      "Climate shocks arrive on a quarterly cadence instead of a decadal one. Heat, flood and drought hit food, water, power and insurance at the same time. Energy costs rise because cooling demand rises. Public money goes to defense against weather rather than to growth.",
    signals: [
      "Insurers withdraw from whole states and countries.",
      "Grid operators call emergency load cuts every summer.",
      "Crop failures move from local news into the macro data.",
    ],
    world: w({ climate: 88, energy: 70, fiscal: 55, trade: 60, order: 60, demog: 60, trust: 60 }),
  },
  {
    id: "unraveling",
    name: "THE UNRAVELING",
    blurb: "Trust collapses at home. Legitimacy, not capital, is the scarce input.",
    premise:
      "Trust in institutions collapses at home. People stop believing official numbers, official media and official courts. The political order is contested, and parts of the state stop working where they are needed most. Legitimacy, not capital, becomes the scarce input.",
    signals: [
      "Two rival vote counts get published after one national election.",
      "Private security spending passes public policing budgets in major cities.",
      "Households route savings and payments around the regulated banks.",
    ],
    world: w({ order: 85, trust: 88, interv: 25, fiscal: 30, capital: 65, aigov: 30, china: 60 }),
  },
  {
    id: "openweights",
    name: "OPEN WEIGHTS",
    blurb: "Frontier capability leaks, then publishing it becomes normal.",
    premise:
      "Frontier weights leak, and then publishing them becomes normal. Capability that used to sit in three data centers now runs on a laptop. Governments try to restrict it and fail. Defense, fraud and verification become everyone's problem at the same time.",
    signals: [
      "A near frontier model ships as a free download and runs on consumer hardware.",
      "Fraud losses rise faster than fraud detection budgets.",
      "Small teams match last year's frontier results at 1% of the cost.",
    ],
    world: w({ aigov: 8, aislope: 80, trust: 62, energy: 45, trade: 35, capital: 45, order: 48, bio: 62, labor: 58 }),
  },
  {
    id: "greywave",
    name: "THE GREY WAVE",
    blurb: "The demographic bill arrives. Workers are the scarce input.",
    premise:
      "The rich world's demographic bill arrives. Workforces shrink faster than the forecasts said they would. Care demand rises while the number of carers falls. States spend on pensions and health, so little is left for anything else.",
    signals: [
      "Care vacancies stay unfilled at any wage employers will pay.",
      "Pension and health spending crowds out public investment.",
      "Immigration becomes an economic emergency and a political one at once.",
    ],
    world: w({ demog: 92, labor: 15, fiscal: 30, capital: 70, climate: 55, trust: 55, china: 70, bio: 55, aislope: 55, trade: 55 }),
  },
  {
    id: "straitcrisis",
    name: "STRAIT CRISIS",
    blurb: "Advanced chip supply stops overnight. Everyone builds their own.",
    premise:
      "A crisis around Taiwan cuts advanced chip supply overnight. Shipping insurance for the region stops being available. Every government treats domestic chip capacity as a survival question and pays whatever it costs. China takes the hardest economic hit and exports deflation everywhere else.",
    signals: [
      "Advanced nodes move to allocation instead of price.",
      "Three governments announce emergency fab programs in one month.",
      "Sea freight rates for East Asia triple in six weeks.",
    ],
    world: w({ china: 92, conflict: 78, trade: 92, interv: 78, capital: 75, energy: 70, fiscal: 45, order: 55, trust: 60, aigov: 70, aislope: 55 }),
  },
  {
    id: "fortress",
    name: "FORTRESS BORDERS",
    blurb: "Climate and demography push people. Rich countries choose walls.",
    premise:
      "Climate stress and demographic imbalance push people across borders in numbers politics cannot absorb. Rich countries choose walls over intake. Trade fragments along the same lines. The United States pulls back, so each bloc secures its own perimeter.",
    signals: [
      "Border and asylum budgets grow faster than defense budgets.",
      "Biometric entry systems become mandatory across whole blocs.",
      "Climate displacement enters national security strategy documents.",
    ],
    world: w({ order: 65, climate: 80, demog: 72, trade: 75, interv: 25, trust: 65, capital: 60, energy: 60 }),
  },
  {
    id: "softlanding",
    name: "SOFT LANDING",
    blurb: "The boring good outcome, and the one fewest people price.",
    premise:
      "Inflation falls without a recession. Rates come down, politics calms, and great power rivalry stays economic. AI improves steadily without breaking anything. This is the boring good outcome, and it is the one fewest people position for.",
    signals: [
      "Policy rates fall 300 basis points with unemployment near 4%.",
      "IPO and venture markets reopen for unprofitable growth companies.",
      "Consumer confidence returns to its pre pandemic level.",
    ],
    world: w({ capital: 20, order: 25, trust: 30, conflict: 20, trade: 25, aislope: 55, fiscal: 60, energy: 35, aigov: 40, china: 45, interv: 40 }),
  },
  {
    id: "genome",
    name: "GENOME UNBOUND",
    blurb: "Biological design gets cheap. Discovery and risk arrive together.",
    premise:
      "Biological design tools become cheap, capable and widely available. AI turns protein and genome design into an engineering task. Cures arrive faster. So does the risk that a small group builds something dangerous. Detection becomes as valuable as discovery.",
    signals: [
      "Benchtop DNA synthesis reaches lab budgets under $50,000.",
      "Design to candidate timelines fall from years to weeks.",
      "Screening rules on synthesis orders become a live policy fight.",
    ],
    world: w({ bio: 95, aislope: 78, trust: 68, order: 58, climate: 55, fiscal: 55, demog: 60, capital: 45, aigov: 35 }),
  },
  {
    id: "powercrunch",
    name: "POWER CRUNCH",
    blurb: "AI demand outruns the grid. Megawatts, not chips, are the constraint.",
    premise:
      "AI demand for electricity outruns the grid. Data centers compete with factories and households for the same megawatts. Power prices rise everywhere the grid is tight. Compute stops being the constraint. Interconnection queues and transformers become the constraint.",
    signals: [
      "Utilities publish multi year interconnection waits for large loads.",
      "Data center sites get chosen by power availability, not by fiber.",
      "Industrial electricity prices become a national political issue.",
    ],
    world: w({ energy: 88, aislope: 85, capital: 68, fiscal: 60, climate: 62, trade: 55, labor: 62, aigov: 55 }),
  },
  {
    id: "coldblocs",
    name: "COLD BLOCS",
    blurb: "Decoupling completes without a war. Two stacks, twice the cost.",
    premise:
      "Decoupling completes without a war. Two technology stacks form, with separate standards, separate chips and separate clouds. Companies pick a side or build both. Nothing explodes. Everything simply costs more and takes longer.",
    signals: [
      "Export controls cover software toolchains, not only hardware.",
      "Multinationals run duplicate engineering teams per bloc.",
      "Standards bodies split into competing forums.",
    ],
    world: w({ trade: 90, china: 75, conflict: 45, interv: 55, capital: 62, energy: 62, aigov: 72, fiscal: 55, trust: 58, aislope: 62, demog: 58 }),
  },
];

export const HORIZON_LABEL: Record<Horizon, string> = {
  3: "3 YEAR",
  5: "5 YEAR",
  10: "10 YEAR",
};

/**
 * Signed index, -50..+50, for one sector in one world at one horizon.
 *
 *   deviation    = (leverValue - 50) / 50            -1 .. +1
 *   contribution = weight x deviation x MULT[speed][horizon]
 *   index        = 50 x sum(contribution) / sum(|weight|)
 *
 * Dividing by the raw sum of absolute weights, and not by the horizon-scaled
 * sum, is what preserves the horizon effect: a sector driven only by slow
 * levers must score near zero at 3 years, not full scale.
 */
export function score(weights: Record<string, number>, world: World, horizon: Horizon): number {
  let raw = 0;
  let denom = 0;
  for (const [id, weight] of Object.entries(weights)) {
    const lever = LMAP[id];
    if (!lever) continue;
    const dev = ((world[id] ?? 50) - 50) / 50;
    raw += weight * dev * MULT[lever.speed][horizon];
    denom += Math.abs(weight);
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

export type Driver = {
  leverId: string;
  name: string;
  contribution: number;
  /** The pole this world sits at, e.g. "Scarce, expensive". */
  pole: string;
  /** The plain-language effect sentence for that pole. */
  effect: string;
};

/** Which levers are doing the most work for one sector, strongest first. */
export function drivers(tech: Tech, world: World, horizon: Horizon): Driver[] {
  const out: Driver[] = [];
  for (const [id, weight] of Object.entries(tech.weights)) {
    const lever = LMAP[id];
    if (!lever) continue;
    const value = world[id] ?? 50;
    const dev = (value - 50) / 50;
    const high = value >= 50;
    out.push({
      leverId: id,
      name: lever.name,
      contribution: weight * dev * MULT[lever.speed][horizon],
      pole: high ? lever.hi : lever.lo,
      effect: high ? LEVER_EFFECT[id]!.hi : LEVER_EFFECT[id]!.lo,
    });
  }
  return out.sort((a, b) => Math.abs(b.contribution) - Math.abs(a.contribution));
}

/** A lever that is actually moved in this world, with how far it has landed. */
export type Force = {
  leverId: string;
  name: string;
  pole: string;
  effect: string;
  /** |deviation| x horizon multiplier, 0..1. How loud this force is right now. */
  strength: number;
  landed: "now" | "building" | "later";
};

/**
 * The forces at work in a dealt world, loudest first.
 *
 * Only levers pushed at least 12 points off the midpoint count. A lever set
 * hard but slow reads as "later" at a 3 year horizon, which is the whole point
 * of the horizon mechanic.
 */
export function forces(world: World, horizon: Horizon): Force[] {
  return LEVERS.map((l) => {
    const value = world[l.id] ?? 50;
    const dev = (value - 50) / 50;
    const m = MULT[l.speed][horizon];
    const high = value >= 50;
    const strength = Math.abs(dev) * m;
    return {
      leverId: l.id,
      name: l.name,
      pole: high ? l.hi : l.lo,
      effect: high ? LEVER_EFFECT[l.id]!.hi : LEVER_EFFECT[l.id]!.lo,
      strength,
      landed: (m >= 0.8 ? "now" : m >= 0.4 ? "building" : "later") as Force["landed"],
      dev,
    };
  })
    .filter((f) => Math.abs(f.dev) >= 0.24)
    .sort((a, b) => b.strength - a.strength)
    .map(({ dev: _dev, ...f }) => f);
}

/**
 * Internal contradictions in a world. A player who spots one of these
 * understands the scenario better than the ranking alone can teach.
 */
/** Read one lever out of a world, defaulting to the midpoint. */
const at = (s: World, id: string): number => s[id] ?? 50;

export const TENSIONS: { when: (s: World) => boolean; text: string }[] = [
  { when: (s) => at(s, "conflict") >= 65 && at(s, "fiscal") <= 40, text: "This is a war economy on a broke state. Either debt rises sharply, or the programs get cut." },
  { when: (s) => at(s, "aislope") >= 70 && at(s, "energy") >= 65, text: "AI compounds while energy is scarce. Power becomes the binding constraint, not chips." },
  { when: (s) => at(s, "aislope") >= 70 && at(s, "aigov") >= 70, text: "Capability rises while access narrows. Value concentrates in a few licensed operators and the open ecosystem thins out." },
  { when: (s) => at(s, "labor") >= 65 && at(s, "demog") >= 65, text: "Steep aging and an automation surplus fight each other. One of them has to dominate the labor market." },
  { when: (s) => at(s, "trade") >= 70 && at(s, "fiscal") <= 40, text: "Supply chains are reshoring without the money to subsidize them. The cost passes to consumers and reshoring slows." },
  { when: (s) => at(s, "trust") >= 70 && at(s, "order") <= 35, text: "Trust has collapsed but the political order holds. That pairing is unstable. Expect one of the two to move." },
  { when: (s) => at(s, "energy") <= 30 && at(s, "climate") >= 65, text: "Energy is cheap while climate shocks worsen. That means either cheap fossil fuel or a very fast clean buildout." },
  { when: (s) => at(s, "conflict") <= 30 && at(s, "interv") >= 70, text: "Maximum intervention with no great-power conflict means small wars and policing, not peer warfare." },
  { when: (s) => at(s, "aislope") <= 30 && at(s, "labor") >= 65, text: "AI has plateaued yet labor is in surplus. Something other than AI caused that surplus." },
  { when: (s) => at(s, "capital") >= 70 && at(s, "fiscal") >= 65, text: "Private capital is expensive while the state is solvent. Government becomes the buyer of first resort for deep tech." },
  { when: (s) => at(s, "order") >= 65 && at(s, "aislope") >= 70, text: "Political disorder meets fast AI. Surveillance and authentication markets grow together." },
  { when: (s) => at(s, "china") >= 70 && at(s, "trade") <= 35, text: "China is in crisis while trade stays open. That is a deflation story, not a decoupling story." },
  { when: (s) => at(s, "demog") >= 70 && at(s, "labor") <= 35, text: "Workforces shrink and workers stay scarce. Automation has a guaranteed buyer for a decade." },
  { when: (s) => at(s, "climate") >= 70 && at(s, "fiscal") <= 40, text: "Climate shocks arrive faster than the state can pay for defenses. Private risk transfer fills the gap." },
];

export function tensionsFor(world: World): string[] {
  return TENSIONS.filter((t) => t.when(world))
    .map((t) => t.text)
    .slice(0, 3);
}

/** Everything the game needs to describe a dealt world at one horizon. */
export type Reading = {
  horizon: Horizon;
  forces: Force[];
  /** Levers set hard but too slow to have landed by this horizon. */
  pending: string[];
  funds: Ranked[];
  starves: Ranked[];
  tensions: string[];
};

export function readWorld(world: World, horizon: Horizon): Reading {
  const all = forces(world, horizon);
  const ranked = rankAll(world, horizon);
  return {
    horizon,
    forces: all.filter((f) => f.strength >= 0.12).slice(0, 4),
    pending: all.filter((f) => f.strength < 0.12).map((f) => f.name),
    funds: ranked.filter((r) => r.value >= 3).slice(0, 4),
    starves: ranked.filter((r) => r.value <= -3).slice(-4).reverse(),
    tensions: tensionsFor(world),
  };
}

export type Verdict = "strong tailwind" | "tailwind" | "flat" | "headwind" | "strong headwind";

export function verdict(value: number): Verdict {
  if (value >= 22) return "strong tailwind";
  if (value >= 7) return "tailwind";
  if (value > -7) return "flat";
  if (value > -22) return "headwind";
  return "strong headwind";
}

export type Explanation = {
  verdict: Verdict;
  /** One line: the single force that decides this sector's fate here. */
  headline: string;
  /** Two or three sentences on what lifts it and what cuts against it. */
  body: string;
  lifts: Driver[];
  cuts: Driver[];
};

const MATTERS = 0.05;

/**
 * Why one sector moves the way it does in one world at one horizon.
 *
 * The text is assembled from the same numbers that produced the ranking, so it
 * always agrees with the score shown next to it.
 */
export function explain(tech: Tech, world: World, horizon: Horizon): Explanation {
  const value = score(tech.weights, world, horizon);
  const v = verdict(value);
  const ds = drivers(tech, world, horizon);
  const lifts = ds.filter((d) => d.contribution >= MATTERS);
  const cuts = ds.filter((d) => d.contribution <= -MATTERS);
  const top = ds[0];

  if (!top || Math.abs(top.contribution) < MATTERS) {
    return {
      verdict: v,
      headline: `This world is indifferent to ${tech.name.toLowerCase()}.`,
      body: `None of its levers moved far enough off the midpoint to matter over ${horizon} years. Its drivers are ${Object.keys(tech.weights)
        .map((id) => LMAP[id]?.name.toLowerCase())
        .filter(Boolean)
        .join(", ")}, and this world leaves them near neutral.`,
      lifts,
      cuts,
    };
  }

  const dir = top.contribution >= 0 ? "carries" : "sinks";
  const headline = `${top.name} at "${top.pole}" ${dir} it over ${horizon} years.`;

  const parts: string[] = [];
  if (lifts[0]) parts.push(lifts[0].effect);
  if (lifts[1]) parts.push(lifts[1].effect);
  if (cuts[0]) parts.push(`Against it: ${cuts[0].effect.charAt(0).toLowerCase()}${cuts[0].effect.slice(1)}`);
  if (!lifts.length && cuts[1]) parts.push(cuts[1].effect);

  const late = ds.find((d) => {
    const lever = LMAP[d.leverId];
    return lever?.speed === "slow" && Math.abs(tech.weights[d.leverId] ?? 0) >= 0.5;
  });
  if (late && horizon === 3) {
    parts.push(`${late.name} is a slow lever, so it has barely started to bite at 3 years.`);
  } else if (late && horizon === 10) {
    parts.push(`${late.name} is a slow lever, so it does its full work only by year 10.`);
  }

  return { verdict: v, headline, body: parts.join(" "), lifts, cuts };
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
  return `${rounded > 0 ? "+" : rounded < 0 ? "−" : ""}${Math.abs(rounded)}`;
}
