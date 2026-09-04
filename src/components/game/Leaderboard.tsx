import { fmt, type Ranked } from "@/lib/tailwinds";

type Props = {
  ranked: Ranked[];
  candidates: string[];
  pick: string | null;
};

/** Top 6, bottom 3, plus every candidate row wherever it sits. */
function visibleRows(ranked: Ranked[], candidates: string[]): Array<Ranked | "gap"> {
  const keep = new Set<number>();
  ranked.slice(0, 6).forEach((r) => keep.add(r.rank));
  ranked.slice(-3).forEach((r) => keep.add(r.rank));
  for (const name of candidates) {
    const row = ranked.find((r) => r.name === name);
    if (row) keep.add(row.rank);
  }

  const rows: Array<Ranked | "gap"> = [];
  let gapped = false;
  for (const row of ranked) {
    if (keep.has(row.rank)) {
      rows.push(row);
      gapped = false;
    } else if (!gapped) {
      rows.push("gap");
      gapped = true;
    }
  }
  return rows;
}

export function Leaderboard({ ranked, candidates, pick }: Props) {
  const rows = visibleRows(ranked, candidates);


  return (
    <div>
      <div className="mb-2 flex flex-wrap items-baseline gap-2">
        <h3 className="font-mono text-sm font-extrabold uppercase tracking-wide">Sector leaderboard</h3>
        <span className="text-xs font-medium text-muted-foreground">all 25 sectors, live</span>
      </div>
      <div className="surface-plate piece-lg overflow-hidden rounded-xl">
        <ul className="divide-y-2 divide-foreground/10">
          {rows.map((row, i) =>
            row === "gap" ? (
              <li
                key={`gap-${i}`}
                className="px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground"
              >
                · · ·
              </li>
            ) : (
              <li
                key={row.name}
                className={`flex items-center justify-between gap-3 px-4 py-2 ${
                  row.name === champion ? "bg-accent/10" : ""
                }`}
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span
                    className={`w-5 shrink-0 font-mono text-xs font-bold ${
                      row.name === champion ? "text-accent" : "text-muted-foreground"
                    }`}
                  >
                    {String(row.rank).padStart(2, "0")}
                  </span>
                  <span
                    className={`truncate text-sm ${row.name === champion ? "font-semibold" : "font-medium"}`}
                  >
                    {row.name}
                    {row.name === champion && (
                      <span className="ml-2 font-mono text-[9px] font-bold uppercase tracking-wider text-accent">
                        your bet
                      </span>
                    )}
                  </span>
                </div>
                <span
                  className={`tabular shrink-0 font-mono text-base font-extrabold ${
                    row.value >= 0 ? "text-tailwind" : "text-headwind"
                  }`}
                >
                  {fmt(row.value)}
                </span>
              </li>
            ),
          )}
        </ul>
      </div>
    </div>
  );
}
