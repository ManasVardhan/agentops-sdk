import { GitHubIcon, Logo, XIcon } from "@/components/fx/icons"
import { Separator } from "@/components/ui/separator"
import { FETCHED_AT, PACKAGES, fmtDate } from "@/lib/data"

export function Footer() {
  return (
    <footer className="relative border-t bg-background/60 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="flex flex-col gap-10 md:flex-row md:justify-between">
          <div className="max-w-sm">
            <div className="flex items-center gap-2.5 font-semibold">
              <Logo className="size-7" /> AgentOps SDK
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              Built and maintained by <span className="text-foreground">Manas Vardhan</span>. Seven open-source packages for building,
              testing and running LLM agents in production.
            </p>
            <div className="mt-4 flex gap-2">
              <a
                href="https://github.com/ManasVardhan"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                <GitHubIcon className="size-4" /> ManasVardhan
              </a>
              <a
                href="https://x.com/manas__vardhan"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                <XIcon className="size-3.5" /> @manas__vardhan
              </a>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-x-10 gap-y-2 font-mono text-[12px] sm:grid-cols-2">
            {PACKAGES.map((p) => (
              <a key={p.name} href={p.pypi} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
                <span className="size-1.5 rounded-full" style={{ background: p.color }} />
                {p.name}
              </a>
            ))}
          </div>
        </div>
        <Separator className="my-8" />
        <p className="font-mono text-[11px] text-muted-foreground">
          Data fetched from PyPI / pypistats on {fmtDate(FETCHED_AT, true)}.
        </p>
      </div>
    </footer>
  )
}
