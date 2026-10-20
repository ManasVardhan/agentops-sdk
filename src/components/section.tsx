import type { ReactNode } from "react"
import { Reveal } from "@/components/fx/reveal"
import { cn } from "@/lib/utils"

export function Section({
  id,
  title,
  description,
  children,
  className,
}: {
  id: string
  title: ReactNode
  description?: ReactNode
  children: ReactNode
  className?: string
}) {
  return (
    <section id={id} className={cn("relative mx-auto w-full max-w-6xl scroll-mt-16 px-4 py-20 sm:px-6 sm:py-28", className)}>
      <Reveal className="mb-10 max-w-2xl sm:mb-14">
        <h2 className="group text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
          <a href={`#${id}`} className="relative">
            <span
              aria-hidden
              className="absolute top-0 -left-6 hidden text-muted-foreground/50 opacity-0 transition-opacity group-hover:opacity-100 sm:inline"
            >
              #
            </span>
            {title}
          </a>
        </h2>
        {description && <p className="mt-4 text-base text-pretty text-muted-foreground sm:text-lg">{description}</p>}
      </Reveal>
      {children}
    </section>
  )
}
