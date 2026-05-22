import { useEffect, useRef, useState } from "react"

const SPACING = 48
const ISLAND_COUNT = 5

type Dot = { x: number; y: number }

type Island = {
  cx: number
  cy: number
  ax: number
  ay: number
  fx: number
  fy: number
  px: number
  py: number
  radius: number
  freq: number
  phase: number
}

function buildDots(w: number, h: number): Dot[] {
  const cols = Math.ceil(w / SPACING) + 2
  const rows = Math.ceil(h / SPACING) + 2
  const dots: Dot[] = []
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      dots.push({ x: c * SPACING, y: r * SPACING })
    }
  }
  return dots
}

function buildIslands(w: number, h: number): Island[] {
  const islands: Island[] = []
  for (let i = 0; i < ISLAND_COUNT; i++) {
    islands.push({
      cx: w / 2,
      cy: h / 2,
      ax: w * (0.25 + Math.random() * 0.25),
      ay: h * (0.25 + Math.random() * 0.25),
      fx: 0.2 + Math.random() * 0.25,
      fy: 0.18 + Math.random() * 0.25,
      px: Math.random() * Math.PI * 2,
      py: Math.random() * Math.PI * 2,
      radius: 140 + Math.random() * 180,
      freq: 1.8 + Math.random() * 1.8,
      phase: Math.random() * Math.PI * 2,
    })
  }
  return islands
}

export default function GridBackground() {
  const [dots, setDots] = useState<Dot[]>(() =>
    typeof window === "undefined"
      ? []
      : buildDots(window.innerWidth, window.innerHeight)
  )
  const islandsRef = useRef<Island[]>(
    typeof window === "undefined"
      ? []
      : buildIslands(window.innerWidth, window.innerHeight)
  )
  const elsRef = useRef<(HTMLSpanElement | null)[]>([])

  useEffect(() => {
    const onResize = () => {
      setDots(buildDots(window.innerWidth, window.innerHeight))
      islandsRef.current = buildIslands(window.innerWidth, window.innerHeight)
    }
    onResize()
    window.addEventListener("resize", onResize)
    return () => window.removeEventListener("resize", onResize)
  }, [])

  useEffect(() => {
    let raf = 0
    const tick = (t: number) => {
      const time = t / 1000
      const islands = islandsRef.current
      for (const isl of islands) {
        isl.cx =
          window.innerWidth / 2 + Math.sin(time * isl.fx + isl.px) * isl.ax
        isl.cy =
          window.innerHeight / 2 + Math.cos(time * isl.fy + isl.py) * isl.ay
      }
      for (let i = 0; i < dots.length; i++) {
        const el = elsRef.current[i]
        if (!el) continue
        const d = dots[i]
        let intensity = 0
        for (const isl of islands) {
          const dx = d.x - isl.cx
          const dy = d.y - isl.cy
          const distSq = dx * dx + dy * dy
          const r2 = isl.radius * isl.radius
          const g = Math.exp(-distSq / r2)
          intensity += g * (0.5 + 0.5 * Math.sin(time * isl.freq + isl.phase))
        }
        intensity = Math.min(1, intensity)
        const scale = 0.25 + intensity * 0.5
        el.style.transform = `scale(${scale})`
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [dots])

  return (
    <div
      aria-hidden
      className="grid-bg pointer-events-none fixed inset-0 -z-10"
    >
      {dots.map((d, i) => (
        <span
          key={i}
          ref={(el) => {
            elsRef.current[i] = el
          }}
          className="grid-dot"
          style={{ left: `${d.x}px`, top: `${d.y}px` }}
        />
      ))}
    </div>
  )
}
