import { useCallback, useState } from "react"
import { MotionConfig } from "motion/react"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Nav } from "@/components/sections/nav"
import { Hero } from "@/components/sections/hero"
import { Lifecycle } from "@/components/sections/lifecycle"
import { Packages } from "@/components/sections/packages"
import { Quickstart } from "@/components/sections/quickstart"
import { Downloads } from "@/components/sections/downloads"
import { Footprint } from "@/components/sections/footprint"
import { Footer } from "@/components/sections/footer"
import { PACKAGES } from "@/lib/data"

export default function App() {
  const [selected, setSelected] = useState(PACKAGES[0].name)
  const openQuickstart = useCallback((name: string) => {
    setSelected(name)
    document.getElementById("quickstart")?.scrollIntoView({ behavior: "smooth", block: "start" })
  }, [])

  return (
    <MotionConfig reducedMotion="user">
      <TooltipProvider delayDuration={150}>
        <div className="relative min-h-screen overflow-x-clip">
          <div className="pointer-events-none fixed inset-0 -z-10" aria-hidden="true">
            <div className="bg-grid absolute inset-0" />
            <div className="bg-noise absolute inset-0" />
            <div className="absolute -top-40 left-1/2 h-[480px] w-[900px] max-w-[160vw] -translate-x-1/2 rounded-full bg-brand/10 blur-[120px]" />
          </div>
          <Nav />
          <main>
            <Hero />
            <Lifecycle />
            <Packages onQuickstart={openQuickstart} />
            <Quickstart value={selected} onValueChange={setSelected} />
            <Downloads />
            <Footprint />
          </main>
          <Footer />
        </div>
      </TooltipProvider>
    </MotionConfig>
  )
}
