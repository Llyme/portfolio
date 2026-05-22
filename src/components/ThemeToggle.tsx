import { useTheme } from "./theme-provider"
import { Moon, Sun } from "lucide-react"

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const resolved =
    theme === "system"
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
      : theme
  const next = resolved === "dark" ? "light" : "dark"

  return (
    <button
      aria-label="Toggle theme"
      onClick={() => setTheme(next)}
      className="fixed top-4 right-4 z-50 rounded-full p-2 transition hover:text-theme"
    >
      {resolved === "dark" ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
    </button>
  )
}
