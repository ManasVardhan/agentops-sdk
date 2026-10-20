import { useCallback, useEffect, useState } from "react"

export type Theme = "dark" | "light"
const KEY = "agentops-theme"

function readTheme(): Theme {
  return document.documentElement.classList.contains("dark") ? "dark" : "light"
}

/** Dark-first theme that remembers the viewer's choice when storage is available. */
export function useTheme() {
  const [theme, setTheme] = useState<Theme>(readTheme)

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle("dark", theme === "dark")
    root.dataset.theme = theme
    try {
      localStorage.setItem(KEY, theme)
    } catch {
      /* storage blocked: theme still works for this visit */
    }
  }, [theme])

  const toggle = useCallback(() => setTheme((t) => (t === "dark" ? "light" : "dark")), [])
  return { theme, toggle }
}
