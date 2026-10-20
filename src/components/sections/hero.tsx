import { ArrowDown, ArrowUpRight } from "lucide-react"
import { motion } from "motion/react"
import { Button } from "@/components/ui/button"
import { InstallTerminal } from "@/components/fx/terminal"
import { NumberTicker } from "@/components/fx/number-ticker"
import { GitHubIcon } from "@/components/fx/icons"
import { DATE_RANGE, RELEASES, STAGES, TOTALS, fmtDate } from "@/lib/data"

const LATEST = RELEASES[RELEASES.length - 1]

const ease = [0.22, 1, 0.36, 1] as const

export function Hero() {
  const stats = [
    { label: "packages on PyPI", value: TOTALS.packages, hint: "pip installable, independently versioned" },
    { label: "downloads", value: TOTALS.downloads, hint: `daily pypistats since ${fmtDate(DATE_RANGE.start)}` },
    { label: "tests", value: TOTALS.tests, hint: "across the seven repositories" },
    { label: "releases", value: TOTALS.releases, hint: "published versions to date" },
  ]
  return (
    <section id="top" className="relative mx-auto w-full max-w-6xl px-4 pt-14 pb-16 sm:px-6 sm:pt-24 sm:pb-24">
      <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-14">
        <div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease }}>
            <a
              href={LATEST.pkg.pypi}
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-center gap-2 rounded-md border border-border bg-card/60 py-1 pr-2.5 pl-1 text-sm text-muted-foreground transition-colors hover:border-foreground/20 hover:text-foreground"
            >
              <span className="rounded bg-brand px-1.5 py-0.5 text-xs font-medium text-brand-foreground">New</span>
              <span>
                <span className="text-foreground">{LATEST.pkg.name} {LATEST.version}</span> on PyPI
              </span>
              <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05, ease }}
            className="mt-6 text-5xl font-semibold tracking-[-0.04em] sm:text-7xl"
          >
            AgentOps
            <span className="ml-3 bg-gradient-to-br from-brand to-brand/50 bg-clip-text text-transparent">SDK</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.12, ease }}
            className="mt-6 max-w-xl text-lg text-pretty text-muted-foreground sm:text-xl"
          >
            A modular toolkit for the full lifecycle of LLM agents. Seven small, focused Python packages that{" "}
            <span className="text-foreground">{STAGES.map((s) => s.label.toLowerCase()).slice(0, -1).join(", ")}</span>, and{" "}
            <span className="text-foreground">control cost</span>. Install only the pieces you need.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease }}
            className="mt-8 flex flex-wrap gap-3"
          >
            <Button size="lg" asChild className="bg-brand text-brand-foreground hover:bg-brand/90">
              <a href="#packages">
                Explore the packages <ArrowDown className="size-4" />
              </a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="https://github.com/ManasVardhan/agentops-sdk" target="_blank" rel="noreferrer">
                <GitHubIcon className="size-4" /> GitHub <ArrowUpRight className="size-3.5 opacity-60" />
              </a>
            </Button>
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.25, ease }}
          className="min-w-0"
        >
          <InstallTerminal />
        </motion.div>
      </div>

      <motion.dl
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.35, ease }}
        className="mt-16 grid grid-cols-2 overflow-hidden rounded-xl border bg-border sm:mt-20 lg:grid-cols-4"
        style={{ gap: 1 }}
      >
        {stats.map((s) => (
          <div key={s.label} className="bg-background/90 p-5 backdrop-blur sm:p-6">
            <dt className="text-sm text-muted-foreground first-letter:uppercase">{s.label}</dt>
            <dd className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
              <NumberTicker value={s.value} />
            </dd>
            <dd className="mt-1 text-xs text-muted-foreground">{s.hint}</dd>
          </div>
        ))}
      </motion.dl>
    </section>
  )
}
