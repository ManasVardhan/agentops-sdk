import { Fragment } from "react"
import { motion } from "motion/react"
import { CornerDownLeft } from "lucide-react"
import { Section } from "@/components/section"
import { PackageIcon } from "@/components/fx/icons"
import { STAGES, byStage } from "@/lib/data"

function Connector({ delay }: { delay: number }) {
  return (
    <div className="relative flex shrink-0 items-center justify-center lg:w-6" aria-hidden="true">
      {/* vertical on mobile, horizontal on desktop */}
      <div className="relative h-8 w-px overflow-hidden bg-border lg:h-px lg:w-full">
        <div
          className="beam-y absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-transparent via-brand to-transparent lg:hidden"
          style={{ animationDelay: `${delay}s` }}
        />
        <div
          className="beam-x absolute inset-y-0 left-0 hidden w-1/2 bg-gradient-to-r from-transparent via-brand to-transparent lg:block"
          style={{ animationDelay: `${delay}s` }}
        />
      </div>
      <div className="absolute size-1.5 rounded-full bg-brand/70 ring-4 ring-background" />
    </div>
  )
}

export function Lifecycle() {
  return (
    <Section
      id="lifecycle"
      title="One toolkit, five stages of an agent's life"
      description="Each package owns one job and does it well. Together they cover an agent from its first prompt to its monthly bill, and every stage works on its own."
    >
      <div className="flex flex-col items-stretch lg:flex-row">
        {STAGES.map((stage, i) => (
          <Fragment key={stage.id}>
            {i > 0 && <Connector delay={i * 0.35} />}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.55, delay: i * 0.09, ease: [0.22, 1, 0.36, 1] }}
              className="group relative flex flex-1 flex-col rounded-xl border bg-card/60 p-4 backdrop-blur transition-colors hover:border-brand/40 lg:min-w-0"
            >
              <h3 className="text-lg font-semibold tracking-tight">{stage.label}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{stage.verb}</p>
              <p className="mt-3 hidden text-xs leading-relaxed text-muted-foreground/80 xl:block">{stage.blurb}</p>
              <div className="mt-4 flex flex-col gap-2 lg:mt-auto lg:pt-4">
                {byStage(stage.id).map((p) => (
                  <a
                    key={p.name}
                    href={`#pkg-${p.name}`}
                    className="flex items-center gap-2 rounded-lg border bg-background/60 px-2 py-1.5 font-mono text-[12px] lg:text-[11px] xl:text-[12px] transition-colors hover:bg-accent"
                    style={{ borderColor: `color-mix(in oklab, ${p.color} 35%, transparent)` }}
                  >
                    <span
                      className="grid size-6 shrink-0 place-items-center rounded-md lg:size-5 xl:size-6"
                      style={{ background: `color-mix(in oklab, ${p.color} 18%, transparent)`, color: p.color }}
                    >
                      <PackageIcon icon={p.icon} className="size-3.5" />
                    </span>
                    <span className="leading-tight">{p.name}</span>
                  </a>
                ))}
              </div>
            </motion.div>
          </Fragment>
        ))}
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="relative mx-[10%] hidden h-8 rounded-b-2xl border-x border-b border-dashed border-brand/40 lg:block"
        aria-hidden="true"
      >
        <span className="absolute -bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-2 bg-background px-3 font-mono text-[11px] text-muted-foreground">
          <CornerDownLeft className="size-3 text-brand" />
          traces, failures and spend feed the next build
        </span>
      </motion.div>
      <p className="mt-6 flex items-center gap-2 font-mono text-[11px] text-muted-foreground lg:hidden">
        <CornerDownLeft className="size-3 text-brand" /> traces, failures and spend feed the next build
      </p>
    </Section>
  )
}
