import { Gauge, GitCompareArrows, Hammer, ListTree, ShieldCheck, Siren, Wallet, type LucideProps } from "lucide-react"
import type { PackageMeta } from "@/data/meta"

const MAP = {
  forge: Hammer,
  diff: GitCompareArrows,
  bench: Gauge,
  shield: ShieldCheck,
  replay: ListTree,
  siren: Siren,
  wallet: Wallet,
} as const

export function PackageIcon({ icon, ...props }: { icon: PackageMeta["icon"] } & LucideProps) {
  const Icon = MAP[icon]
  return <Icon {...props} />
}

export function GitHubIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M12 .5C5.65.5.5 5.65.5 12a11.5 11.5 0 0 0 7.86 10.92c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.04-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.04 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.58.23 2.75.11 3.04.74.81 1.19 1.83 1.19 3.09 0 4.41-2.69 5.39-5.25 5.67.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
    </svg>
  )
}

export function XIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M18.24 2.25h3.31l-7.23 8.26 8.5 11.24h-6.65l-5.21-6.82-5.97 6.82H1.68l7.73-8.84L1.25 2.25h6.83l4.71 6.23 5.45-6.23Zm-1.16 17.52h1.83L7.08 4.13H5.12l11.96 15.64Z" />
    </svg>
  )
}

export function PyPIIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M12 2.5 20.5 7v10L12 21.5 3.5 17V7Z" />
      <path d="M3.5 7 12 11.5 20.5 7M12 11.5v10" />
    </svg>
  )
}

/** The AgentOps mark: five lifecycle nodes on a loop. */
export function Logo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <rect x="1" y="1" width="30" height="30" rx="8" fill="var(--brand)" />
      <g fill="none" stroke="var(--brand-foreground)" strokeWidth="2" strokeLinecap="round">
        <path d="M8 21 L13 11 L19 17 L24 9" />
      </g>
      <g fill="var(--brand-foreground)">
        <circle cx="8" cy="21" r="2.2" />
        <circle cx="13" cy="11" r="2.2" />
        <circle cx="19" cy="17" r="2.2" />
        <circle cx="24" cy="9" r="2.2" />
      </g>
    </svg>
  )
}
