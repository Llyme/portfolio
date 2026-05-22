import { useCallback, useEffect, useRef, useState, Children } from "react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel"
import { ChevronUp, ChevronDown } from "lucide-react"

type Props = {
  children: React.ReactNode
  cooldownMs?: number
}

export default function SnapScroll({ children, cooldownMs = 700 }: Props) {
  const sections = Children.toArray(children)
  const [api, setApi] = useState<CarouselApi>()
  const [selected, setSelected] = useState(0)
  const [sectionInfo, setSectionInfo] = useState<
    {
      hasScroll: boolean
      pillLen: number
      progress: number
      tabs?: { id: string; label: string; height?: number }[]
      active?: string
      clientHeight?: number
    }[]
  >(() => sections.map(() => ({ hasScroll: false, pillLen: 8, progress: 0 })))
  const lockRef = useRef(false)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!api) return
    const onSelect = () => {
      const i = api.selectedScrollSnap()
      setSelected(i)
      window.dispatchEvent(new CustomEvent("snap-change", { detail: i }))
    }
    onSelect()
    api.on("select", onSelect)
    api.on("reInit", onSelect)
    return () => {
      api.off("select", onSelect)
    }
  }, [api])

  useEffect(() => {
    if (!api) return

    const go = (dir: 1 | -1) => {
      if (lockRef.current) return
      if (dir > 0 && !api.canScrollNext()) return
      if (dir < 0 && !api.canScrollPrev()) return
      lockRef.current = true
      if (dir > 0) api.scrollNext()
      else api.scrollPrev()
      window.setTimeout(() => {
        lockRef.current = false
      }, cooldownMs)
    }

    const getActiveScrollable = (): HTMLElement | null => {
      const root = rootRef.current
      if (!root) return null
      const slides = root.querySelectorAll<HTMLElement>(
        "[data-slot=carousel-item]"
      )
      const slide = slides[api.selectedScrollSnap()]
      return slide?.querySelector<HTMLElement>("[data-scrollable]") ?? null
    }

    const BOUNDARY_COOLDOWN_MS = 400
    let boundaryReachedAt = 0
    let lastBoundaryKey = ""

    const onWheel = (e: WheelEvent) => {
      const speed = Math.abs(e.deltaY)

      if (speed < 5) return

      const scrollable = getActiveScrollable()

      if (scrollable) {
        const atTop = scrollable.scrollTop <= 0
        const atBottom =
          scrollable.scrollTop + scrollable.clientHeight >=
          scrollable.scrollHeight - 1
        const goingDown = e.deltaY > 0
        if ((goingDown && !atBottom) || (!goingDown && !atTop)) {
          e.preventDefault()
          scrollable.scrollBy({ top: e.deltaY, behavior: "auto" })
          const nowAtTop = scrollable.scrollTop <= 0
          const nowAtBottom =
            scrollable.scrollTop + scrollable.clientHeight >=
            scrollable.scrollHeight - 1
          const reachedKey =
            goingDown && nowAtBottom
              ? "bottom"
              : !goingDown && nowAtTop
                ? "top"
                : ""
          if (reachedKey && lastBoundaryKey !== reachedKey) {
            lastBoundaryKey = reachedKey
            boundaryReachedAt = performance.now()
          } else if (!reachedKey) {
            lastBoundaryKey = ""
          }
          return
        }

        const key = goingDown ? "bottom" : "top"
        const now = performance.now()
        if (lastBoundaryKey !== key) {
          lastBoundaryKey = key
          boundaryReachedAt = now
        }
        if (now - boundaryReachedAt < BOUNDARY_COOLDOWN_MS) {
          e.preventDefault()
          return
        }
      }

      e.preventDefault()

      if (speed < 100) return

      go(e.deltaY > 0 ? 1 : -1)
    }

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "PageDown") {
        e.preventDefault()
        go(1)
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        e.preventDefault()
        go(-1)
      }
    }

    const onAdvance = (e: Event) => {
      const dir = (e as CustomEvent).detail as 1 | -1
      go(dir)
    }

    let touchStartY: number | null = null
    let touchAtTop = false
    let touchAtBottom = false
    let touchScrollable: HTMLElement | null = null
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) return
      const t = e.target as HTMLElement | null
      const sc =
        t?.closest<HTMLElement>("[data-scrollable]") ?? getActiveScrollable()
      touchScrollable = sc
      touchStartY = e.touches[0].clientY
      if (sc) {
        touchAtTop = sc.scrollTop <= 2
        touchAtBottom = sc.scrollTop + sc.clientHeight >= sc.scrollHeight - 2
      } else {
        touchAtTop = true
        touchAtBottom = true
      }
    }
    const onTouchEnd = (e: TouchEvent) => {
      if (touchStartY == null) return
      const endY = e.changedTouches[0]?.clientY ?? touchStartY
      const dy = endY - touchStartY
      const sc = touchScrollable
      const stillAtTop = sc ? sc.scrollTop <= 2 : true
      const stillAtBottom = sc
        ? sc.scrollTop + sc.clientHeight >= sc.scrollHeight - 2
        : true
      const SWIPE = 60
      if (dy < -SWIPE && touchAtBottom && stillAtBottom) {
        go(1)
      } else if (dy > SWIPE && touchAtTop && stillAtTop) {
        go(-1)
      }
      touchStartY = null
      touchScrollable = null
    }

    window.addEventListener("wheel", onWheel, { passive: false })
    window.addEventListener("keydown", onKey)
    window.addEventListener("snap-advance", onAdvance as EventListener)
    window.addEventListener("touchstart", onTouchStart, { passive: true })
    window.addEventListener("touchend", onTouchEnd, { passive: true })
    return () => {
      window.removeEventListener("wheel", onWheel)
      window.removeEventListener("keydown", onKey)
      window.removeEventListener("snap-advance", onAdvance as EventListener)
      window.removeEventListener("touchstart", onTouchStart)
      window.removeEventListener("touchend", onTouchEnd)
    }
  }, [api, cooldownMs])

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const slides = root.querySelectorAll<HTMLElement>(
      "[data-slot=carousel-item]"
    )
    const cleanups: (() => void)[] = []
    setSectionInfo((prev) =>
      prev.map((_info, i) => {
        const slide = slides[i]
        const sc = slide?.querySelector<HTMLElement>("[data-scrollable]")
        const sectionEl =
          slide?.querySelector<HTMLElement>("[data-section-tabs]") ?? null
        const readTabs = () => {
          if (!sectionEl) return { tabs: undefined, active: undefined }
          try {
            const tabs = JSON.parse(
              sectionEl.getAttribute("data-section-tabs") || "[]"
            )
            const active =
              sectionEl.getAttribute("data-active-tab") || undefined
            return { tabs, active }
          } catch {
            return { tabs: undefined, active: undefined }
          }
        }
        if (!sc) {
          const { tabs, active } = readTabs()
          if (sectionEl) {
            const amo = new MutationObserver(() => {
              const { tabs: t2, active: a2 } = readTabs()
              setSectionInfo((cur) => {
                const next = [...cur]
                next[i] = { ...next[i], tabs: t2, active: a2 }
                return next
              })
            })
            amo.observe(sectionEl, {
              attributes: true,
              attributeFilter: ["data-active-tab", "data-section-tabs"],
            })
            cleanups.push(() => amo.disconnect())
          }
          return { hasScroll: false, pillLen: 8, progress: 0, tabs, active }
        }
        const measure = () => {
          const ratio = sc.scrollHeight / Math.max(1, sc.clientHeight)
          const pillLen = Math.min(80, Math.max(20, ratio * 12))
          const hasScroll = sc.scrollHeight > sc.clientHeight + 1
          const max = sc.scrollHeight - sc.clientHeight
          const p = max > 0 ? sc.scrollTop / max : 0
          const { tabs, active } = readTabs()
          setSectionInfo((cur) => {
            const next = [...cur]
            next[i] = {
              hasScroll,
              pillLen,
              progress: p,
              tabs,
              active,
              clientHeight: sc.clientHeight,
            }
            return next
          })
        }
        const update = () => {
          const max = sc.scrollHeight - sc.clientHeight
          const p = max > 0 ? sc.scrollTop / max : 0
          setSectionInfo((cur) => {
            const next = [...cur]
            next[i] = { ...next[i], progress: p }
            return next
          })
        }
        sc.addEventListener("scroll", update, { passive: true })
        const ro = new ResizeObserver(measure)
        ro.observe(sc)
        const mo = new MutationObserver(measure)
        mo.observe(sc, { childList: true, subtree: true })
        let amo: MutationObserver | null = null
        if (sectionEl) {
          amo = new MutationObserver(measure)
          amo.observe(sectionEl, {
            attributes: true,
            attributeFilter: ["data-active-tab", "data-section-tabs"],
          })
        }
        cleanups.push(() => {
          sc.removeEventListener("scroll", update)
          ro.disconnect()
          mo.disconnect()
          amo?.disconnect()
        })
        const ratio = sc.scrollHeight / Math.max(1, sc.clientHeight)
        const pillLen = Math.min(80, Math.max(20, ratio * 12))
        const { tabs, active } = readTabs()
        return {
          hasScroll: sc.scrollHeight > sc.clientHeight + 1,
          pillLen,
          progress: 0,
          tabs,
          active,
          clientHeight: sc.clientHeight,
        }
      })
    )
    return () => cleanups.forEach((c) => c())
  }, [sections.length, api])

  const scrollTo = useCallback(
    (i: number) => {
      const slideEl = rootRef.current?.querySelectorAll<HTMLElement>(
        "[data-slot=carousel-item]"
      )[i]
      const sc = slideEl?.querySelector<HTMLElement>("[data-scrollable]")
      if (sc) {
        if (i === selected) {
          const target = sc.scrollTop <= 0 ? sc.scrollHeight : 0
          sc.scrollTo({ top: target, behavior: "smooth" })
          return
        }
        sc.scrollTop = 0
      }
      api?.scrollTo(i)
    },
    [api, selected]
  )

  return (
    <div ref={rootRef} className="relative h-svh w-screen overflow-hidden">
      <Carousel
        orientation="vertical"
        opts={{
          align: "start",
          watchDrag: (emblaApi, e) => {
            const t = e.target as HTMLElement | null
            const isTouch = (e as PointerEvent).pointerType === "touch"
            const sc =
              t?.closest<HTMLElement>("[data-scrollable]") ??
              (() => {
                const root = rootRef.current
                const slide = root?.querySelectorAll<HTMLElement>(
                  "[data-slot=carousel-item]"
                )[emblaApi.selectedScrollSnap()]
                return slide?.querySelector<HTMLElement>("[data-scrollable]") ?? null
              })()
            if (!isTouch && t?.closest("[data-no-drag]") && sc) return false
            if (!sc) return true
            const atTop = sc.scrollTop <= 2
            const atBottom =
              sc.scrollTop + sc.clientHeight >= sc.scrollHeight - 2
            return atTop || atBottom
          },
        }}
        setApi={setApi}
        className="h-svh w-screen"
      >
        <CarouselContent className="!mt-0 h-svh">
          {sections.map((child, i) => (
            <CarouselItem key={i} className="h-svh basis-full !pt-0">
              <div className="h-svh w-screen overflow-hidden">{child}</div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      {selected > 0 && (
        <button
          aria-label="Previous section"
          onClick={() => {
            const slideEl = rootRef.current?.querySelectorAll<HTMLElement>(
              "[data-slot=carousel-item]"
            )[selected]
            const sc = slideEl?.querySelector<HTMLElement>("[data-scrollable]")
            if (sc && sc.scrollTop > 0) {
              sc.scrollTo({ top: 0, behavior: "smooth" })
              return
            }
            api?.scrollPrev()
          }}
          className="hover:text-theme fixed top-4 left-1/2 z-50 -translate-x-1/2 rounded-full bg-white p-2 text-black transition dark:bg-black dark:text-white"
        >
          <ChevronUp className="h-5 w-5" />
        </button>
      )}
      {selected < sections.length - 1 && (
        <button
          aria-label="Next section"
          onClick={() => {
            const slideEl = rootRef.current?.querySelectorAll<HTMLElement>(
              "[data-slot=carousel-item]"
            )[selected]
            const sc = slideEl?.querySelector<HTMLElement>("[data-scrollable]")
            if (
              sc &&
              sc.scrollTop + sc.clientHeight < sc.scrollHeight - 1
            ) {
              sc.scrollTo({ top: sc.scrollHeight, behavior: "smooth" })
              return
            }
            api?.scrollNext()
          }}
          className="hover:text-theme fixed bottom-4 left-1/2 z-50 -translate-x-1/2 rounded-full bg-white p-2 text-black transition dark:bg-black dark:text-white"
        >
          <ChevronDown className="h-5 w-5" />
        </button>
      )}
      <div className="fixed top-1/2 right-6 z-50 flex -translate-y-1/2 flex-col items-center gap-3">
        {sections.map((_, i) => {
          const info = sectionInfo[i]
          const active = i === selected
          if (info?.hasScroll) {
            return (
              <button
                key={i}
                aria-label={`Section ${i + 1}`}
                onClick={() => scrollTo(i)}
                className={`relative w-2 overflow-hidden rounded-full border transition ${
                  active ? "border-theme scale-110" : "border-current"
                }`}
                style={{ height: info.pillLen }}
              >
                {active && (
                  <span
                    className="bg-theme absolute left-0 w-full rounded-full transition-[top]"
                    style={{
                      height: Math.max(6, info.pillLen * 0.25),
                      top: `calc(${info.progress * 100}% - ${
                        info.progress * Math.max(6, info.pillLen * 0.25)
                      }px)`,
                    }}
                  />
                )}
              </button>
            )
          }
          return (
            <button
              key={i}
              aria-label={`Section ${i + 1}`}
              onClick={() => scrollTo(i)}
              className={`h-2 w-2 rounded-full border transition ${
                active ? "bg-theme border-theme scale-125" : "bg-transparent"
              }`}
            />
          )
        })}
      </div>
    </div>
  )
}
