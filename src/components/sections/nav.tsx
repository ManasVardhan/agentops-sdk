import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { GitHubIcon, Logo } from "@/components/fx/icons"
import { useTheme } from "@/hooks/use-theme"

const LINKS = [
  ["Lifecycle", "#lifecycle"],
  ["Packages", "#packages"],
  ["Quickstart", "#quickstart"],
  ["Downloads", "#downloads"],
  ["Footprint", "#footprint"],
] as const

export function Nav() {
  const { theme, toggle } = useTheme()
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <a href="#top" className="flex items-center gap-2.5 font-semibold tracking-tight">
          <Logo className="size-7" />
          <span>
            AgentOps <span className="text-muted-foreground">SDK</span>
          </span>
        </a>
        <nav className="hidden items-center gap-1 md:flex" aria-label="Sections">
          {LINKS.map(([label, href]) => (
            <a
              key={href}
              href={href}
              className="rounded-md px-2.5 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              {label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={toggle} aria-label="Toggle color theme">
                {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>{theme === "dark" ? "Light mode" : "Dark mode"}</TooltipContent>
          </Tooltip>
          <Button variant="ghost" size="icon" asChild>
            <a href="https://github.com/ManasVardhan/agentops-sdk" target="_blank" rel="noreferrer" aria-label="AgentOps SDK on GitHub">
              <GitHubIcon className="size-4" />
            </a>
          </Button>
        </div>
      </div>
    </header>
  )
}
