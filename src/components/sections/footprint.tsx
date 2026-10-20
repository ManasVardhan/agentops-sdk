import { useState } from "react"
import { motion } from "motion/react"
import { Feather } from "lucide-react"
import { Section } from "@/components/section"
import { ALL_DEPS, PACKAGES } from "@/lib/data"
import { cn } from "@/lib/utils"

const STDLIB = "stdlib only"
const ROW = 46
const W = 760
const LX = 230 // left node x
const RX = 530 // right node x
const rightNodes = [...ALL_DEPS.map((d) => d.name), STDLIB]
const H = Math.max(PACKAGES.length, rightNodes.length) * ROW + 10
const ly = (i: number) => 26 + i * ROW + ((rightNodes.length - PACKAGES.length) * ROW) / 2 * Number(rightNodes.length > PACKAGES.length)
const ry = (i: number) => 26 + i * ROW + ((PACKAGES.length - rightNodes.length) * ROW) / 2 * Number(PACKAGES.length > rightNodes.length)

const edges = PACKAGES.flatMap((p, pi) =>
  (p.depNames.length ? p.depNames : [STDLIB]).map((d) => ({ p, pi, d, di: rightNodes.indexOf(d) })),
)

function Graph() {
  const [hover, setHover] = useState<string | null>(null)
  const active = (pkg: string, dep: string) => !hover || hover === pkg || hover === dep
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="Bipartite graph of packages and their core dependencies">
      {edges.map((e, i) => {
        const y1 = ly(e.pi)
        const y2 = ry(e.di)
        const mid = (LX + RX) / 2
        return (
          <motion.path
            key={i}
            d={`M${LX + 8},${y1} C${mid},${y1} ${mid},${y2} ${RX - 8},${y2}`}
            fill="none"
            stroke={e.p.color}
            strokeWidth={active(e.p.name, e.d) && hover ? 2.25 : 1.5}
            strokeDasharray={e.d === STDLIB ? "4 4" : undefined}
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: active(e.p.name, e.d) ? 0.85 : 0.08 }}
            animate={{ opacity: active(e.p.name, e.d) ? 0.85 : 0.08 }}
            viewport={{ once: true }}
            transition={{ pathLength: { duration: 1, delay: 0.2 + i * 0.05, ease: "easeInOut" }, opacity: { duration: 0.25 } }}
          />
        )
      })}
      {PACKAGES.map((p, i) => (
        <g
          key={p.name}
          className="cursor-default"
          onMouseEnter={() => setHover(p.name)}
          onMouseLeave={() => setHover(null)}
          opacity={!hover || hover === p.name || edges.some((e) => e.p.name === p.name && e.d === hover) ? 1 : 0.35}
          style={{ transition: "opacity .25s" }}
        >
          <rect x={0} y={ly(i) - 17} width={LX + 12} height={34} fill="transparent" />
          <text x={LX - 14} y={ly(i)} dy="0.35em" textAnchor="end" className="fill-foreground font-mono" fontSize={13}>
            {p.name}
          </text>
          <text x={LX - 14} y={ly(i) + 15} dy="0.35em" textAnchor="end" className="fill-muted-foreground font-mono" fontSize={10}>
            {p.depNames.length ? `${p.depNames.length} core dep${p.depNames.length > 1 ? "s" : ""}` : "zero deps"}
          </text>
          <circle cx={LX} cy={ly(i)} r={6} fill={p.color} stroke="var(--background)" strokeWidth={2} />
        </g>
      ))}
      {rightNodes.map((d, i) => {
        const users = edges.filter((e) => e.d === d).length
        const isStd = d === STDLIB
        return (
          <g
            key={d}
            onMouseEnter={() => setHover(d)}
            onMouseLeave={() => setHover(null)}
            opacity={!hover || hover === d || edges.some((e) => e.d === d && e.p.name === hover) ? 1 : 0.35}
            style={{ transition: "opacity .25s" }}
          >
            <rect x={RX - 12} y={ry(i) - 17} width={W - RX + 12} height={34} fill="transparent" />
            <rect
              x={RX - 7}
              y={ry(i) - 7}
              width={14}
              height={14}
              rx={4}
              fill={isStd ? "var(--background)" : "var(--muted)"}
              stroke={isStd ? "var(--brand)" : "var(--border)"}
              strokeDasharray={isStd ? "3 2" : undefined}
            />
            <text x={RX + 18} y={ry(i)} dy="0.35em" className={cn("font-mono", isStd ? "fill-brand" : "fill-foreground")} fontSize={13}>
              {d}
            </text>
            <text x={RX + 18} y={ry(i) + 15} dy="0.35em" className="fill-muted-foreground font-mono" fontSize={10}>
              used by {users}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

function Matrix() {
  const cols = ALL_DEPS.map((d) => d.name)
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-separate border-spacing-y-1 font-mono text-[11px]">
        <thead>
          <tr className="text-muted-foreground">
            <th className="pb-2 text-left font-normal">package</th>
            {cols.map((c) => (
              <th key={c} className="px-1 pb-2 align-bottom font-normal">
                <span className="inline-block [writing-mode:vertical-rl] rotate-180">{c}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {PACKAGES.map((p) => (
            <tr key={p.name}>
              <td className="pr-2 whitespace-nowrap">
                <span className="mr-1.5 inline-block size-1.5 rounded-full align-middle" style={{ background: p.color }} />
                {p.name}
              </td>
              {cols.map((c) => (
                <td key={c} className="px-1 text-center">
                  {p.depNames.includes(c) ? (
                    <span className="inline-block size-3 rounded-[3px]" style={{ background: p.color }} />
                  ) : (
                    <span className="inline-block size-3 rounded-[3px] border border-dashed border-border" />
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function Footprint() {
  const zero = PACKAGES.filter((p) => p.depNames.length === 0)
  const avg = PACKAGES.reduce((a, p) => a + p.depNames.length, 0) / PACKAGES.length
  const optional = new Set(PACKAGES.flatMap((p) => p.extras.filter((e) => e !== "dev" && e !== "all").map((e) => `${p.name}[${e}]`)))
  const stats = [
    { v: String(ALL_DEPS.length), k: "third-party core deps across all seven packages" },
    { v: String(zero.length), k: `zero-dependency packages: ${zero.map((p) => p.name).join(", ")}` },
    { v: avg.toFixed(1), k: "core deps per package, on average" },
    { v: String(optional.size), k: "optional extras keep heavy SDKs out of the default install" },
  ]
  return (
    <Section
      id="footprint"
      title="Small on purpose"
      description="Installing an ops tool should not drag in half of PyPI. Core dependencies are limited to a few well-known libraries, and every vendor SDK sits behind an optional extra."
    >
      <div className="grid gap-4 lg:grid-cols-[1fr_2.2fr]">
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border bg-border lg:grid-cols-1">
          {stats.map((s) => (
            <div key={s.k} className="bg-card/80 p-5">
              <p className="text-3xl font-semibold tracking-tight">{s.v}</p>
              <p className="mt-1 text-xs text-pretty text-muted-foreground">{s.k}</p>
            </div>
          ))}
        </div>
        <div className="rounded-2xl border bg-card/60 p-4 backdrop-blur sm:p-6">
          <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
            <Feather className="size-4 text-brand" />
            <span className="hidden md:inline">Hover a package or a dependency to trace its edges.</span>
            <span className="md:hidden">Core dependencies per package.</span>
          </div>
          <div className="hidden md:block">
            <Graph />
          </div>
          <div className="md:hidden">
            <Matrix />
            <p className="mt-3 font-mono text-[11px] text-muted-foreground">
              {zero.map((p) => p.name).join(" and ")} run on the standard library alone.
            </p>
          </div>
        </div>
      </div>
    </Section>
  )
}
