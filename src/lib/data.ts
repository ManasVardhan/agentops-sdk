import raw from "@/data/packages.json"
import { META, STAGES, type PackageMeta, type StageId } from "@/data/meta"

type RawPackage = {
  name: string
  repo: string
  version: string
  summary: string
  keywords: string
  requiresPython: string
  dependencies: string[]
  extras: string[]
  releases: Record<string, string>
  recent: { last_day: number; last_week: number; last_month: number }
  dailyDownloads: [string, number][]
  tests: number
}

const DATA = raw as unknown as { fetchedAt: string; packages: RawPackage[] }

export type Package = RawPackage &
  PackageMeta & {
    slot: number // 1-based chart color slot
    color: string // css var reference
    keywordList: string[]
    depNames: string[]
    totalDownloads: number
    weekly: number[]
    pypi: string
  }

export const FETCHED_AT = DATA.fetchedAt

const DAY = 86_400_000
const toDay = (iso: string) => Date.parse(iso + "T00:00:00Z")
const isoOf = (t: number) => new Date(t).toISOString().slice(0, 10)

// Full daily range covered by the data (missing days in pypistats mean zero).
const allDates = DATA.packages.flatMap((p) => p.dailyDownloads.map(([d]) => d))
const startT = Math.min(...allDates.map(toDay))
const endT = Math.max(...allDates.map(toDay))
export const DATE_RANGE = { start: isoOf(startT), end: isoOf(endT) }
export const DAY_COUNT = Math.round((endT - startT) / DAY) + 1

function denseSeries(p: RawPackage): number[] {
  const out = new Array<number>(DAY_COUNT).fill(0)
  for (const [d, n] of p.dailyDownloads) out[Math.round((toDay(d) - startT) / DAY)] += n
  return out
}

const dense = new Map(DATA.packages.map((p) => [p.name, denseSeries(p)]))

export const PACKAGES: Package[] = META.map((m, i) => {
  const r = DATA.packages.find((p) => p.name === m.name)
  if (!r) throw new Error(`missing package data for ${m.name}`)
  const series = dense.get(m.name)!
  const weekly: number[] = []
  for (let s = 0; s < series.length; s += 7) weekly.push(series.slice(s, s + 7).reduce((a, b) => a + b, 0))
  return {
    ...r,
    ...m,
    slot: i + 1,
    color: `var(--series-${i + 1})`,
    keywordList: r.keywords.split(",").map((k) => k.trim()).filter(Boolean),
    depNames: r.dependencies.map((d) => d.split(/[<>=!~ ;[]/)[0]),
    totalDownloads: series.reduce((a, b) => a + b, 0),
    weekly,
    pypi: `https://pypi.org/project/${r.name}/`,
  }
})

export const byStage = (id: StageId) => PACKAGES.filter((p) => p.stage === id)
export { STAGES }

export type DailyRow = { date: string } & Record<string, number | string>

export function dailyRows(smooth: boolean): DailyRow[] {
  const rows: DailyRow[] = []
  for (let i = 0; i < DAY_COUNT; i++) {
    const row: DailyRow = { date: isoOf(startT + i * DAY) }
    for (const p of PACKAGES) {
      const s = dense.get(p.name)!
      if (smooth) {
        const lo = Math.max(0, i - 6)
        const win = s.slice(lo, i + 1)
        row[p.name] = Math.round((win.reduce((a, b) => a + b, 0) / win.length) * 10) / 10
      } else {
        row[p.name] = s[i]
      }
    }
    rows.push(row)
  }
  return rows
}

export type Release = { pkg: Package; version: string; date: string }

export const RELEASES: Release[] = PACKAGES.flatMap((pkg) =>
  Object.entries(pkg.releases).map(([version, date]) => ({ pkg, version, date })),
).sort((a, b) => a.date.localeCompare(b.date) || a.pkg.slot - b.pkg.slot)

export const TOTALS = {
  packages: PACKAGES.length,
  downloads: PACKAGES.reduce((a, p) => a + p.totalDownloads, 0),
  tests: PACKAGES.reduce((a, p) => a + p.tests, 0),
  releases: RELEASES.length,
  lastMonth: PACKAGES.reduce((a, p) => a + p.recent.last_month, 0),
}

export const ALL_DEPS: { name: string; users: Package[] }[] = (() => {
  const m = new Map<string, Package[]>()
  for (const p of PACKAGES) for (const d of p.depNames) m.set(d, [...(m.get(d) ?? []), p])
  return [...m.entries()]
    .map(([name, users]) => ({ name, users }))
    .sort((a, b) => b.users.length - a.users.length || a.name.localeCompare(b.name))
})()

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
export function fmtDate(iso: string, withYear = false) {
  const [y, m, d] = iso.split("-").map(Number)
  return `${MONTHS[m - 1]} ${d}${withYear ? `, ${y}` : ""}`
}
export const fmtNum = (n: number) => n.toLocaleString("en-US")
