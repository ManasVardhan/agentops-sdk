import { useState, type ReactNode } from "react"
import { Check, Copy } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

const PY_KEYWORDS = new Set([
  "from", "import", "as", "with", "def", "return", "class", "if", "else", "for", "in", "not", "and", "or",
  "None", "True", "False", "print", "lambda", "async", "await",
])

type Tok = { t: string; c?: string }

// A deliberately small highlighter: comments, strings, keywords, decorators, numbers, flags.
function tokenize(line: string, lang: "bash" | "python"): Tok[] {
  const out: Tok[] = []
  const re =
    lang === "python"
      ? /(#.*$)|(f?"(?:[^"\\]|\\.)*"|f?'(?:[^'\\]|\\.)*')|(@\w+)|(\b\d+(?:\.\d+)?\b)|(\b[A-Za-z_]\w*\b)/g
      : /(#.*$)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')|(\s--?[\w-]+)|(\b\d+(?:\.\d+)?\b)|(^\s*[\w.-]+|\|\s*[\w.-]+)/g
  let last = 0
  for (const m of line.matchAll(re)) {
    const i = m.index ?? 0
    if (i > last) out.push({ t: line.slice(last, i) })
    const [full, com, str, deco, num, word] = m
    if (com) out.push({ t: full, c: "text-muted-foreground/70 italic" })
    else if (str) out.push({ t: full, c: "text-[var(--series-3)]" })
    else if (deco) out.push({ t: full, c: lang === "python" ? "text-[var(--series-5)]" : "text-[var(--series-7)]" })
    else if (num) out.push({ t: full, c: "text-[var(--series-2)]" })
    else if (word) {
      if (lang === "python") {
        if (PY_KEYWORDS.has(word)) out.push({ t: full, c: "text-[var(--series-7)]" })
        else if (/^[A-Z]/.test(word)) out.push({ t: full, c: "text-[var(--series-1)]" })
        else out.push({ t: full })
      } else {
        out.push({ t: full, c: "text-brand font-medium" })
      }
    }
    last = i + full.length
  }
  if (last < line.length) out.push({ t: line.slice(last) })
  return out
}

export function CopyButton({ text, className, label = "Copy" }: { text: string; className?: string; label?: string }) {
  const [done, setDone] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setDone(true)
      setTimeout(() => setDone(false), 1600)
    } catch {
      /* clipboard can be unavailable on insecure origins */
    }
  }
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          size="icon"
          variant="ghost"
          onClick={copy}
          aria-label={done ? "Copied" : label}
          className={cn("size-7 text-muted-foreground hover:text-foreground", className)}
        >
          {done ? <Check className="size-3.5 text-brand" /> : <Copy className="size-3.5" />}
        </Button>
      </TooltipTrigger>
      <TooltipContent>{done ? "Copied" : label}</TooltipContent>
    </Tooltip>
  )
}

export function CodeBlock({
  code,
  lang,
  title,
  className,
  actions,
}: {
  code: string
  lang: "bash" | "python"
  title?: ReactNode
  className?: string
  actions?: ReactNode
}) {
  return (
    <div className={cn("overflow-hidden rounded-lg border bg-[var(--code-bg)]", className)}>
      <div className="flex items-center justify-between gap-2 border-b px-3 py-1.5">
        <div className="flex min-w-0 items-center gap-2 font-mono text-[11px] text-muted-foreground">
          <span className="rounded bg-muted px-1.5 py-0.5 uppercase tracking-wider">{lang === "bash" ? "sh" : "py"}</span>
          <span className="truncate">{title}</span>
        </div>
        <div className="flex items-center gap-1">
          {actions}
          <CopyButton text={code} />
        </div>
      </div>
      <pre className="overflow-x-auto p-4 text-[12.5px] leading-relaxed">
        <code>
          {code.split("\n").map((line, i) => (
            <div key={i} className="min-h-[1.2em] whitespace-pre">
              {lang === "bash" && line.trim() && !line.trim().startsWith("#") && !line.startsWith(" ") && (
                <span className="select-none text-muted-foreground/50">$ </span>
              )}
              {tokenize(line, lang).map((tok, j) => (
                <span key={j} className={tok.c}>
                  {tok.t}
                </span>
              ))}
            </div>
          ))}
        </code>
      </pre>
    </div>
  )
}
