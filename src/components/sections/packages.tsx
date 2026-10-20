import { useRef, type MouseEvent } from "react"
import { motion } from "motion/react"
import { FlaskConical, Terminal } from "lucide-react"
import { Section } from "@/components/section"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { GitHubIcon, PackageIcon, PyPIIcon } from "@/components/fx/icons"
import { Sparkline } from "@/components/fx/sparkline"
import { DATE_RANGE, PACKAGES, STAGES, fmtDate, fmtNum, type Package } from "@/lib/data"

function PackageCard({ p, index, onQuickstart }: { p: Package; index: number; onQuickstart: (name: string) => void }) {
  const ref = useRef<HTMLDivElement>(null)
  const stage = STAGES.find((s) => s.id === p.stage)!
  const onMove = (e: MouseEvent) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    el.style.setProperty("--mx", `${e.clientX - r.left}px`)
    el.style.setProperty("--my", `${e.clientY - r.top}px`)
  }
  return (
    <motion.div
      id={`pkg-${p.name}`}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.55, delay: (index % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="scroll-mt-24"
    >
      <Card
        ref={ref}
        onMouseMove={onMove}
        className="group/pkg relative h-full gap-0 bg-card/70 py-0 backdrop-blur transition-[box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/10"
        style={{ ["--pc" as string]: p.color }}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover/pkg:opacity-100"
          style={{
            background: "radial-gradient(360px circle at var(--mx, 50%) var(--my, 0%), color-mix(in oklab, var(--pc) 12%, transparent), transparent 70%)",
          }}
        />
        <div className="absolute inset-x-0 top-0 h-px opacity-70" style={{ background: `linear-gradient(90deg, transparent, ${p.color}, transparent)` }} />
        <div className="relative flex h-full flex-col p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <span
                className="grid size-10 shrink-0 place-items-center rounded-lg ring-1"
                style={{
                  background: `color-mix(in oklab, ${p.color} 16%, transparent)`,
                  color: p.color,
                  ["--tw-ring-color" as string]: `color-mix(in oklab, ${p.color} 35%, transparent)`,
                }}
              >
                <PackageIcon icon={p.icon} className="size-5" />
              </span>
              <div className="min-w-0">
                <h3 className="truncate font-mono text-[15px] font-medium">{p.name}</h3>
                <p className="text-xs text-muted-foreground">{stage.label}</p>
              </div>
            </div>
            <Badge variant="secondary" className="shrink-0 font-mono text-[11px]">
              v{p.version}
            </Badge>
          </div>

          <p className="mt-4 text-sm leading-relaxed text-pretty text-muted-foreground">{p.summary}</p>

          <div className="mt-4 flex flex-wrap gap-1.5">
            {p.keywordList.map((k) => (
              <span key={k} className="rounded-md border px-1.5 py-0.5 font-mono text-[10.5px] text-muted-foreground">
                {k}
              </span>
            ))}
          </div>

          <div className="mt-auto pt-5">
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="rounded-lg border bg-background/40 px-3 pt-2.5 pb-1.5">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="text-lg font-semibold tabular-nums">{fmtNum(p.totalDownloads)}</span>
                    <span className="font-mono text-[10.5px] text-muted-foreground">downloads · weekly</span>
                  </div>
                  <Sparkline values={p.weekly} color={p.color} className="mt-1 h-8 w-full" />
                </div>
              </TooltipTrigger>
              <TooltipContent className="max-w-60">
                {fmtNum(p.totalDownloads)} downloads from {fmtDate(DATE_RANGE.start)} to {fmtDate(DATE_RANGE.end)}. Peak week: {fmtNum(Math.max(...p.weekly))}.
                Last 30 days: {fmtNum(p.recent.last_month)}.
              </TooltipContent>
            </Tooltip>

            <Separator className="my-4" />

            <div className="flex items-center justify-between gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
                    <FlaskConical className="size-3.5" style={{ color: p.color }} />
                    {fmtNum(p.tests)} tests
                  </span>
                </TooltipTrigger>
                <TooltipContent>Test count in the package repository</TooltipContent>
              </Tooltip>
              <div className="flex items-center gap-0.5">
                <Button variant="ghost" size="icon" className="size-8" asChild>
                  <a href={p.pypi} target="_blank" rel="noreferrer" aria-label={`${p.name} on PyPI`} title="PyPI">
                    <PyPIIcon className="size-4" />
                  </a>
                </Button>
                <Button variant="ghost" size="icon" className="size-8" asChild>
                  <a href={p.repo} target="_blank" rel="noreferrer" aria-label={`${p.name} source on GitHub`} title="GitHub">
                    <GitHubIcon className="size-4" />
                  </a>
                </Button>
                <Button variant="outline" size="sm" className="ml-1 h-8 gap-1.5 font-mono text-xs" onClick={() => onQuickstart(p.name)}>
                  <Terminal className="size-3.5" /> quickstart
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

export function Packages({ onQuickstart }: { onQuickstart: (name: string) => void }) {
  return (
    <Section
      id="packages"
      title="Seven packages, zero lock-in"
      description="Every package is published on PyPI, versioned on its own and imports nothing from its siblings. Heads up: several pip names differ from their repository names, so copy the install line from here."
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {PACKAGES.map((p, i) => (
          <PackageCard key={p.name} p={p} index={i} onQuickstart={onQuickstart} />
        ))}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: 0.16 }}
          className="flex flex-col justify-center rounded-xl border border-dashed p-6 sm:col-span-2 lg:col-span-2"
        >
          <p className="text-sm text-muted-foreground">Mix and match</p>
          <p className="mt-3 text-xl font-semibold tracking-tight text-balance">
            Guard inputs with <span className="font-mono text-[var(--series-4)]">llm-shelter</span>, record the run with{" "}
            <span className="font-mono text-[var(--series-5)]">agent-trace-replay</span>, and cap the bill with{" "}
            <span className="font-mono text-[var(--series-7)]">llm-cost-guardian</span>.
          </p>
          <code className="mt-4 block overflow-x-auto rounded-lg border bg-[var(--code-bg)] px-3 py-2.5 font-mono text-[12px] text-muted-foreground">
            <span className="text-muted-foreground/60">$ </span>pip install llm-shelter agent-trace-replay llm-cost-guardian
          </code>
        </motion.div>
      </div>
    </Section>
  )
}
