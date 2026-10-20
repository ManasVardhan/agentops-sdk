import { useEffect, useMemo, useRef, useState } from "react"
import { useInView, useReducedMotion } from "motion/react"
import { PACKAGES, ALL_DEPS } from "@/lib/data"

type Line = { kind: "cmd" | "out" | "note"; text: string; color?: string }

function buildScript(): Line[] {
  const lines: Line[] = []
  for (const p of PACKAGES) {
    lines.push({ kind: "cmd", text: `pip install ${p.name}` })
    lines.push({ kind: "out", text: `Successfully installed ${p.name}-${p.version}`, color: p.color })
  }
  lines.push({
    kind: "note",
    text: `# ${PACKAGES.length} packages, ${ALL_DEPS.length} third-party core deps in total. Install only what you need.`,
  })
  return lines
}

/** A terminal that types out installing every package in the toolkit. */
export function InstallTerminal() {
  const script = useMemo(buildScript, [])
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true })
  const reduce = useReducedMotion()
  const [lineIdx, setLineIdx] = useState(0)
  const [charIdx, setCharIdx] = useState(0)
  const finished = lineIdx >= script.length

  useEffect(() => {
    if (reduce) {
      setLineIdx(script.length)
      return
    }
    if (!inView || finished) return
    const line = script[lineIdx]
    if (line.kind === "cmd" && charIdx < line.text.length) {
      const t = setTimeout(() => setCharIdx((c) => c + 1), 24 + Math.random() * 40)
      return () => clearTimeout(t)
    }
    const pause = line.kind === "cmd" ? 380 : line.kind === "out" ? 260 : 0
    const t = setTimeout(() => {
      setLineIdx((i) => i + 1)
      setCharIdx(0)
    }, pause)
    return () => clearTimeout(t)
  }, [inView, reduce, finished, lineIdx, charIdx, script])

  const visible = script.slice(0, Math.min(lineIdx + 1, script.length))

  return (
    <div ref={ref} className="relative rounded-xl border bg-card/80 shadow-2xl shadow-black/20 backdrop-blur">
      <div className="border-beam" />
      <div className="flex items-center gap-2 border-b px-4 py-2.5">
        <span className="size-2.5 rounded-full bg-[#ff5f57]" />
        <span className="size-2.5 rounded-full bg-[#febc2e]" />
        <span className="size-2.5 rounded-full bg-[#28c840]" />
        <span className="ml-2 font-mono text-[11px] text-muted-foreground">~/agent-project · zsh</span>
      </div>
      <div
        className="flex h-[300px] flex-col justify-end overflow-hidden px-4 py-3 font-mono text-[11px] leading-[1.75] [mask-image:linear-gradient(to_bottom,transparent,#000_18%)] sm:h-[340px] sm:text-[12.5px]"
        role="img"
        aria-label={`Terminal installing ${PACKAGES.map((p) => p.name).join(", ")}`}
      >
        {visible.map((line, i) => {
          const active = i === lineIdx
          if (line.kind === "cmd") {
            const text = active ? line.text.slice(0, charIdx) : line.text
            return (
              <div key={i} className="whitespace-pre-wrap break-all">
                <span className="text-brand">➜</span> <span className="text-muted-foreground">~</span>{" "}
                <span>{text}</span>
                {active && <span className="caret ml-px inline-block h-[1.05em] w-[0.55em] translate-y-[2px] bg-brand" />}
              </div>
            )
          }
          if (active && !finished && line.kind !== "note") return null
          return (
            <div
              key={i}
              className={line.kind === "note" ? "mt-1 text-muted-foreground" : "flex items-center gap-2 text-muted-foreground"}
            >
              {line.kind === "out" && <span className="size-1.5 shrink-0 rounded-full" style={{ background: line.color }} />}
              <span className="break-all">{line.text}</span>
            </div>
          )
        })}
        {finished && (
          <div>
            <span className="text-brand">➜</span> <span className="text-muted-foreground">~</span>{" "}
            <span className="caret inline-block h-[1.05em] w-[0.55em] translate-y-[2px] bg-brand" />
          </div>
        )}
      </div>
    </div>
  )
}
