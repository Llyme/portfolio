import { useRef } from "react"
import Text from "@/components/Text"
import { useEnterKey } from "@/hooks/useEnterKey"
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card"
import { experiences, type Experience } from "@/constants/experiences"

function parsePeriod(period: string) {
  const [start, end] = period.split(/\s*[–-]\s*/)
  return { start: start ?? period, end: end ?? "" }
}

function DatePill({
  label,
  showPulse = false,
}: {
  label: string
  showPulse?: boolean
}) {
  const parts = label.split(/\s+/)
  const month = parts.length > 1 ? parts[0] : null
  const year = parts.length > 1 ? parts.slice(1).join(" ") : label
  return (
    <div className="bg-theme relative flex w-[68px] flex-col items-center justify-center rounded-lg px-1 py-1.5 text-center text-white">
      {month && (
        <span className="text-[9px] leading-none font-semibold tracking-widest uppercase">
          {month}
        </span>
      )}
      <span
        className={`${month ? "mt-0.5 text-[11px]" : "text-[10px] tracking-widest uppercase"} leading-none font-bold`}
      >
        {year}
      </span>
      <span
        aria-hidden
        className="border-l-theme absolute top-1/2 -right-[5px] h-0 w-0 -translate-y-1/2 border-y-[7px] border-l-[7px] border-y-transparent"
      />
      {showPulse && (
        <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
        </span>
      )}
    </div>
  )
}

function ExperienceCard({
  e,
}: {
  e: Experience
  index: number
  rootRef: React.RefObject<HTMLElement | null>
}) {
  const { start, end } = parsePeriod(e.period)
  const isCurrent = /present/i.test(end)

  return (
    <div className="relative">
      {end && (
        <div
          className="absolute top-2 z-10 hidden sm:block"
          style={{ left: "-82px" }}
        >
          <DatePill label={end} showPulse={isCurrent} />
        </div>
      )}
      <div
        className="absolute bottom-2 z-10 hidden sm:block"
        style={{ left: "-82px" }}
      >
        <DatePill label={start} />
      </div>
      <Card>
        <CardHeader>
          <Text className="text-xl leading-tight font-bold">{e.role}</Text>
          <div className="mt-0.5 flex flex-wrap items-center gap-x-2">
            <Text className="text-theme text-sm font-semibold">
              {e.company}
            </Text>
            <Text className="text-xs opacity-60">· {e.location}</Text>
          </div>
          <div className="mt-1.5 flex items-center gap-1.5 sm:hidden">
            {isCurrent && (
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
            )}
            <Text className="text-[11px] font-semibold tracking-wide uppercase opacity-70">
              {e.period}
            </Text>
          </div>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            {e.bullets.map((b, j) => (
              <li key={j} className="flex gap-2">
                <span className="text-theme mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rotate-45 bg-current" />
                <span>{b}</span>
              </li>
            ))}
          </ul>
          {e.tech && e.tech.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {e.tech.map((t) => (
                <span
                  key={t}
                  className="bg-theme/10 text-theme rounded-md px-2 py-0.5 font-mono text-[10px]"
                >
                  {t}
                </span>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

const OVERSCROLL_THRESHOLD = 80
const BOUNDARY_COOLDOWN_MS = 300

export default function Experiences() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const enterKey = useEnterKey(sectionRef)

  const onPointerDown = (e: React.PointerEvent<HTMLElement>) => {
    const sc = scrollRef.current
    if (!sc) return
    if (e.pointerType === "mouse" && e.button !== 0) return
    if (e.pointerType === "touch") return
    const section = e.currentTarget
    section.setPointerCapture(e.pointerId)
    let lastY = e.clientY
    let overscroll = 0
    let advanced = false
    let boundaryReachedAt = 0
    let lastBoundaryKey = ""
    const onMove = (ev: PointerEvent) => {
      if (advanced) return
      const dy = ev.clientY - lastY
      lastY = ev.clientY
      const atTop = sc.scrollTop <= 0
      const atBottom = sc.scrollTop + sc.clientHeight >= sc.scrollHeight - 1
      // dragging up (dy<0) scrolls down (scrollTop+=)
      if ((dy < 0 && !atBottom) || (dy > 0 && !atTop)) {
        sc.scrollTop -= dy
        overscroll = 0
        const nowAtTop = sc.scrollTop <= 0
        const nowAtBottom =
          sc.scrollTop + sc.clientHeight >= sc.scrollHeight - 1
        const reachedKey =
          dy < 0 && nowAtBottom ? "bottom" : dy > 0 && nowAtTop ? "top" : ""
        if (reachedKey && lastBoundaryKey !== reachedKey) {
          lastBoundaryKey = reachedKey
          boundaryReachedAt = performance.now()
        } else if (!reachedKey) {
          lastBoundaryKey = ""
        }
        return
      }
      const key = dy < 0 ? "bottom" : "top"
      const now = performance.now()
      if (lastBoundaryKey !== key) {
        lastBoundaryKey = key
        boundaryReachedAt = now
        overscroll = 0
        return
      }
      if (now - boundaryReachedAt < BOUNDARY_COOLDOWN_MS) return
      overscroll += -dy
      if (Math.abs(overscroll) >= OVERSCROLL_THRESHOLD) {
        advanced = true
        window.dispatchEvent(
          new CustomEvent("snap-advance", {
            detail: overscroll > 0 ? 1 : -1,
          })
        )
      }
    }
    const onUp = (ev: PointerEvent) => {
      section.releasePointerCapture(ev.pointerId)
      section.removeEventListener("pointermove", onMove)
      section.removeEventListener("pointerup", onUp)
      section.removeEventListener("pointercancel", onUp)
    }
    section.addEventListener("pointermove", onMove)
    section.addEventListener("pointerup", onUp)
    section.addEventListener("pointercancel", onUp)
  }

  return (
    <section
      ref={sectionRef}
      data-no-drag
      onPointerDown={onPointerDown}
      className="relative flex h-svh w-full cursor-grab flex-col items-center px-4 active:cursor-grabbing sm:px-8"
    >
      <div className="relative min-h-0 w-full max-w-2xl flex-1">
        <div
          ref={scrollRef}
          data-scrollable
          className="no-scrollbar h-full w-full overflow-y-auto"
        >
          <div
            key={`exp-${enterKey}`}
            className="relative z-10 flex flex-col gap-12 pt-[20vh] pb-[30vh] pl-0 sm:pl-28"
          >
            <div
              className="via-theme/60 absolute top-0 bottom-0 left-[104px] hidden w-px bg-gradient-to-b from-transparent to-transparent sm:block"
              aria-hidden
            />
            {experiences.map((e, i) => (
              <div
                key={`${e.company}-${e.role}`}
                className={enterKey === 0 ? "opacity-0" : "enter-slide-right"}
                style={{ animationDelay: `${i * 140}ms` }}
              >
                <ExperienceCard e={e} index={i} rootRef={scrollRef} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
