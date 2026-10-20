import { useMemo, useRef, useState } from "react"
import { useInView } from "motion/react"
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, LabelList, XAxis, YAxis } from "recharts"
import { Section } from "@/components/section"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { DATE_RANGE, PACKAGES, TOTALS, dailyRows, fmtDate, fmtNum } from "@/lib/data"

const config: ChartConfig = Object.fromEntries(PACKAGES.map((p) => [p.name, { label: p.name, color: p.color }]))

/** Mount children only once they scroll into view so chart entry animations are seen. */
function WhenVisible({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })
  return (
    <div ref={ref} className={className}>
      {inView ? children : null}
    </div>
  )
}

function StackedDownloads() {
  const [mode, setMode] = useState<"daily" | "smooth">("smooth")
  const data = useMemo(() => dailyRows(mode === "smooth"), [mode])
  return (
    <Card className="bg-card/70 backdrop-blur lg:col-span-3">
      <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <CardTitle className="text-base">Daily downloads, stacked by package</CardTitle>
          <CardDescription>
            {fmtDate(DATE_RANGE.start, true)} to {fmtDate(DATE_RANGE.end, true)} · {fmtNum(TOTALS.downloads)} downloads in total
          </CardDescription>
        </div>
        <ToggleGroup
          type="single"
          size="sm"
          variant="outline"
          value={mode}
          onValueChange={(v) => v && setMode(v as typeof mode)}
          aria-label="Smoothing"
        >
          <ToggleGroupItem value="daily" className="font-mono text-xs data-[state=on]:border-brand/50 data-[state=on]:bg-brand-muted data-[state=on]:text-brand">
            daily
          </ToggleGroupItem>
          <ToggleGroupItem value="smooth" className="font-mono text-xs data-[state=on]:border-brand/50 data-[state=on]:bg-brand-muted data-[state=on]:text-brand">
            7-day avg
          </ToggleGroupItem>
        </ToggleGroup>
      </CardHeader>
      <CardContent className="px-2 sm:px-6">
        <WhenVisible className="h-[300px] sm:h-[360px]">
          <ChartContainer config={config} className="aspect-auto h-full w-full">
            <AreaChart data={data} margin={{ left: 0, right: 8, top: 8 }}>
              <defs>
                {PACKAGES.map((p) => (
                  <linearGradient key={p.name} id={`fill-${p.slot}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={p.color} stopOpacity={0.75} />
                    <stop offset="95%" stopColor={p.color} stopOpacity={0.35} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={40}
                tickFormatter={(v: string) => fmtDate(v)}
              />
              <YAxis tickLine={false} axisLine={false} width={34} tickMargin={4} allowDecimals={false} />
              <ChartTooltip
                cursor={{ strokeDasharray: "3 3" }}
                content={
                  <ChartTooltipContent
                    indicator="dot"
                    labelFormatter={(_, payload) => {
                      const row = payload?.[0]?.payload as { date?: string } | undefined
                      return row?.date ? fmtDate(row.date, true) + (mode === "smooth" ? " · 7-day avg" : "") : ""
                    }}
                  />
                }
              />
              {PACKAGES.map((p) => (
                <Area
                  key={p.name}
                  dataKey={p.name}
                  type="monotone"
                  stackId="a"
                  stroke={p.color}
                  strokeWidth={1.25}
                  fill={`url(#fill-${p.slot})`}
                  animationDuration={1200}
                />
              ))}
              <ChartLegend itemSorter={null} content={<ChartLegendContent className="flex-wrap gap-x-4 gap-y-1.5 font-mono text-[11px]" />} />
            </AreaChart>
          </ChartContainer>
        </WhenVisible>
      </CardContent>
    </Card>
  )
}

const RANGES = {
  all: { label: "all", note: `${fmtDate(DATE_RANGE.start)} to ${fmtDate(DATE_RANGE.end)}` },
  month: { label: "30d", note: "last 30 days" },
  week: { label: "7d", note: "last 7 days" },
} as const

function PerPackage() {
  const [range, setRange] = useState<keyof typeof RANGES>("all")
  const data = useMemo(
    () =>
      PACKAGES.map((p) => ({
        name: p.name,
        color: p.color,
        value: range === "all" ? p.totalDownloads : range === "month" ? p.recent.last_month : p.recent.last_week,
      })).sort((a, b) => b.value - a.value),
    [range],
  )
  return (
    <Card className="bg-card/70 backdrop-blur lg:col-span-2">
      <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <CardTitle className="text-base">Downloads per package</CardTitle>
          <CardDescription>{RANGES[range].note}, sorted</CardDescription>
        </div>
        <ToggleGroup
          type="single"
          size="sm"
          variant="outline"
          value={range}
          onValueChange={(v) => v && setRange(v as typeof range)}
          aria-label="Time range"
        >
          {Object.entries(RANGES).map(([k, r]) => (
            <ToggleGroupItem key={k} value={k} className="font-mono text-xs data-[state=on]:border-brand/50 data-[state=on]:bg-brand-muted data-[state=on]:text-brand">
              {r.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </CardHeader>
      <CardContent className="px-2 sm:px-6">
        <WhenVisible className="h-[320px]">
          <ChartContainer config={config} className="aspect-auto h-full w-full">
            <BarChart data={data} layout="vertical" margin={{ left: 4, right: 44 }} barCategoryGap={6}>
              <XAxis type="number" hide />
              <YAxis
                type="category"
                dataKey="name"
                tickLine={false}
                axisLine={false}
                width={128}
                tick={{ fontSize: 11, fontFamily: "var(--font-mono)" }}
              />
              <ChartTooltip cursor={{ fillOpacity: 0.4 }} content={<ChartTooltipContent hideIndicator nameKey="name" />} />
              <Bar dataKey="value" radius={[0, 4, 4, 0]} animationDuration={900}>
                {data.map((d) => (
                  <Cell key={d.name} fill={d.color} />
                ))}
                <LabelList
                  dataKey="value"
                  position="right"
                  offset={8}
                  className="fill-foreground font-mono"
                  fontSize={11}
                  formatter={(v: unknown) => fmtNum(Number(v))}
                />
              </Bar>
            </BarChart>
          </ChartContainer>
        </WhenVisible>
      </CardContent>
    </Card>
  )
}

function Insights() {
  const top = [...PACKAGES].sort((a, b) => b.totalDownloads - a.totalDownloads)[0]
  const peak = useMemo(() => {
    const rows = dailyRows(false)
    let best = { date: "", total: 0 }
    for (const r of rows) {
      const t = PACKAGES.reduce((a, p) => a + Number(r[p.name]), 0)
      if (t > best.total) best = { date: r.date, total: t }
    }
    return best
  }, [])
  const items = [
    { k: "most downloaded", v: top.name, sub: `${fmtNum(top.totalDownloads)} downloads`, color: top.color },
    { k: "busiest day", v: fmtDate(peak.date, true), sub: `${fmtNum(peak.total)} downloads across the toolkit` },
    { k: "last 30 days", v: fmtNum(TOTALS.lastMonth), sub: "downloads, all packages" },
  ]
  return (
    <div className="grid gap-px overflow-hidden rounded-xl border bg-border lg:col-span-1 lg:grid-rows-3">
      {items.map((it) => (
        <div key={it.k} className="flex flex-col justify-center bg-card/80 p-5">
          <p className="text-sm text-muted-foreground first-letter:uppercase">{it.k}</p>
          <p className="mt-2 flex items-center gap-2 truncate font-mono text-lg font-medium">
            {it.color && <span className="size-2 shrink-0 rounded-full" style={{ background: it.color }} />}
            {it.v}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">{it.sub}</p>
        </div>
      ))}
    </div>
  )
}

export function Downloads() {
  return (
    <Section
      id="downloads"
      title="Downloads, straight from pypistats"
      description="Daily download counts for every package, stacked so you can see both the toolkit total and each package's share. Toggle smoothing to read the trend instead of the spikes."
    >
      <div className="grid gap-4 lg:grid-cols-3">
        <StackedDownloads />
        <PerPackage />
        <Insights />
      </div>
    </Section>
  )
}
