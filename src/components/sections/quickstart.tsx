import { motion } from "motion/react"
import { Check, Info } from "lucide-react"
import { Section } from "@/components/section"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { CodeBlock, CopyButton } from "@/components/fx/code-block"
import { PackageIcon } from "@/components/fx/icons"
import { PACKAGES, type Package } from "@/lib/data"

function Detail({ p }: { p: Package }) {
  const extras = p.extras.filter((e) => e !== "dev")
  const repoName = p.repo.split("/").pop()
  const hasInstall = p.snippets.some((s) => s.code.split("\n").some((l) => l.trim() === `pip install ${p.name}`))
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]"
    >
      <div className="min-w-0">
        <div className="flex items-center gap-3">
          <span
            className="grid size-11 place-items-center rounded-xl"
            style={{ background: `color-mix(in oklab, ${p.color} 16%, transparent)`, color: p.color }}
          >
            <PackageIcon icon={p.icon} className="size-5" />
          </span>
          <div className="min-w-0">
            <h3 className="font-mono text-lg font-medium">{p.name}</h3>
            <p className="font-mono text-xs text-muted-foreground">
              v{p.version} · Python {p.requiresPython}
            </p>
          </div>
        </div>
        <p className="mt-5 text-lg font-medium tracking-tight text-balance">{p.headline}</p>
        <ul className="mt-4 space-y-2.5">
          {p.features.map((f) => (
            <li key={f} className="flex gap-2.5 text-sm text-muted-foreground">
              <Check className="mt-0.5 size-4 shrink-0" style={{ color: p.color }} />
              <span>{f}</span>
            </li>
          ))}
        </ul>

        {(p.importName || repoName !== p.name) && (
          <div className="mt-5 flex gap-2.5 rounded-lg border bg-muted/40 p-3 text-xs text-muted-foreground">
            <Info className="mt-px size-3.5 shrink-0 text-brand" />
            <p>
              Install as <code className="text-foreground">{p.name}</code>
              {p.importName && (
                <>
                  , import as <code className="text-foreground">{p.importName}</code>
                </>
              )}
              {p.cli && (
                <>
                  , run as <code className="text-foreground">{p.cli}</code>
                </>
              )}
              {repoName !== p.name && (
                <>
                  . Source lives in <code className="text-foreground">{repoName}</code>
                </>
              )}
              .
            </p>
          </div>
        )}

        {extras.length > 0 && (
          <div className="mt-6">
            <p className="text-sm text-muted-foreground">Optional extras</p>
            <ul className="mt-3 space-y-1.5">
              {extras.map((e) => {
                const cmd = `pip install "${p.name}[${e}]"`
                return (
                  <li key={e} className="flex items-center justify-between gap-2 rounded-lg border bg-[var(--code-bg)] py-1 pr-1 pl-3">
                    <div className="min-w-0">
                      <code className="block truncate font-mono text-[12px]">
                        <span className="text-muted-foreground">pip install </span>"{p.name}[<span style={{ color: p.color }}>{e}</span>]"
                      </code>
                      {p.extrasInfo?.[e] && (
                        <span className="block truncate text-[11px] text-muted-foreground">{p.extrasInfo[e]}</span>
                      )}
                    </div>
                    <CopyButton text={cmd} label="Copy install command" />
                  </li>
                )
              })}
            </ul>
          </div>
        )}
      </div>

      <div className="min-w-0 space-y-4">
        {!hasInstall && <CodeBlock lang="bash" code={`pip install ${p.name}`} title="install" />}
        {p.snippets.map((s) => (
          <CodeBlock key={s.label} lang={s.lang} code={s.code} title={s.label.toLowerCase()} />
        ))}
      </div>
    </motion.div>
  )
}

export function Quickstart({ value, onValueChange }: { value: string; onValueChange: (v: string) => void }) {
  return (
    <Section
      id="quickstart"
      title="From pip install to first result in under a minute"
      description="Real snippets from each package README at its published version. Pick a package, copy, run."
    >
      <Tabs value={value} onValueChange={onValueChange} className="gap-6">
        <div className="no-scrollbar -mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
          <TabsList className="h-auto w-max gap-1 p-1">
            {PACKAGES.map((p) => (
              <TabsTrigger key={p.name} value={p.name} className="h-8 gap-2 px-2.5 font-mono text-xs">
                <span className="size-2 rounded-full" style={{ background: p.color }} />
                {p.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        <div className="rounded-2xl border bg-card/60 p-5 backdrop-blur sm:p-7">
            {PACKAGES.map((p) => (
              <TabsContent key={p.name} value={p.name} className="mt-0">
                <Detail p={p} />
              </TabsContent>
            ))}
          <div className="mt-6 flex flex-wrap gap-2">
            {PACKAGES.find((p) => p.name === value)?.keywordList.map((k) => (
              <Badge key={k} variant="outline" className="font-mono text-[10.5px] font-normal">
                #{k}
              </Badge>
            ))}
          </div>
        </div>
      </Tabs>
    </Section>
  )
}
