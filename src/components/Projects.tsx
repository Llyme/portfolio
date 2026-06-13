import { useEffect, useRef, useState } from "react"
import { useEnterKey } from "@/hooks/useEnterKey"
import Text from "@/components/Text"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { FiExternalLink, FiEye, FiHeart, FiUsers } from "react-icons/fi"
import {
  CATEGORIES,
  projects,
  type Category,
  type Project,
} from "@/constants/projects"

function formatCount(n: number) {
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, "")}K`
  return String(n)
}

const OVERSCROLL_THRESHOLD = 80
const BOUNDARY_COOLDOWN_MS = 300

function ProjectRow({
  p,
  flip,
  enterClass,
  delay,
}: {
  p: Project
  flip: boolean
  enterClass?: string
  delay?: number
}) {
  if (p.simple || !p.image)
    return <SimpleRow p={p} flip={flip} enterClass={enterClass} delay={delay} />
  return (
    <li className={enterClass} style={{ animationDelay: `${delay ?? 0}ms` }}>
      <div
        className={`relative grid grid-cols-1 items-center gap-4 md:gap-8 ${
          flip
            ? "md:grid-cols-[minmax(min-content,1fr)_380px]"
            : "md:grid-cols-[380px_minmax(min-content,1fr)]"
        }`}
      >
        <div className={`relative ${flip ? "md:order-2" : "md:order-1"}`}>
          {p.image ? (
            <Dialog>
              <DialogTrigger asChild>
                <button
                  type="button"
                  className="relative block aspect-video w-full cursor-zoom-in overflow-hidden rounded-lg border border-foreground/10 bg-gradient-to-br from-zinc-700 to-zinc-900 shadow"
                >
                  <img
                    src={p.image}
                    alt={p.title}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                </button>
              </DialogTrigger>
              <DialogContent className="w-auto max-w-[92vw] border-none bg-transparent p-0 ring-0 sm:max-w-[92vw]">
                <DialogTitle className="sr-only">{p.title}</DialogTitle>
                <img
                  src={p.image}
                  alt={p.title}
                  className="block h-auto max-h-[88vh] w-auto max-w-[92vw] rounded-lg object-contain"
                />
              </DialogContent>
            </Dialog>
          ) : (
            <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-foreground/10 bg-gradient-to-br from-zinc-700 to-zinc-900 shadow">
              <div className="text-theme/40 flex h-full w-full items-center justify-center font-mono text-[10px] tracking-widest uppercase">
                {p.tags[0]}
              </div>
            </div>
          )}
        </div>
        <Card
          className={`overflow-visible ${flip ? "md:order-1 md:text-right" : "md:order-2"}`}
        >
          <CardHeader className="!flex !grid-cols-none items-center justify-between gap-6">
            <CardTitle className="inline-flex items-center gap-2 text-xl leading-tight font-bold whitespace-nowrap lg:text-2xl">
              {p.link ? (
                <a
                  href={p.link}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 hover:underline"
                >
                  <span>{p.title}</span>
                  <FiExternalLink
                    className="text-theme h-4 w-4 shrink-0 opacity-80"
                    aria-hidden
                  />
                </a>
              ) : (
                <span>{p.title}</span>
              )}
            </CardTitle>
            <Text className="text-theme shrink-0 font-mono text-xs tracking-[0.3em] whitespace-nowrap uppercase">
              {p.year}
            </Text>
          </CardHeader>
          <CardContent>
            <Text className="max-w-prose text-sm leading-relaxed opacity-80">
              {p.blurb}
            </Text>
            {p.stats && (
              <div
                className={`mt-3 flex flex-wrap items-center gap-3 text-xs opacity-70 ${flip ? "md:justify-end" : ""}`}
              >
                {p.stats.subs != null && (
                  <span className="inline-flex items-center gap-1">
                    <FiUsers className="h-3.5 w-3.5" aria-hidden />
                    {formatCount(p.stats.subs)} subs
                  </span>
                )}
                {p.stats.favorites != null && (
                  <span className="inline-flex items-center gap-1">
                    <FiHeart className="h-3.5 w-3.5" aria-hidden />
                    {formatCount(p.stats.favorites)}
                  </span>
                )}
                {p.stats.views != null && (
                  <span className="inline-flex items-center gap-1">
                    <FiEye className="h-3.5 w-3.5" aria-hidden />
                    {formatCount(p.stats.views)}
                  </span>
                )}
              </div>
            )}
            <div
              className={`mt-4 flex flex-wrap gap-1.5 ${flip ? "md:justify-end" : ""}`}
            >
              {p.tags.map((t) => (
                <span
                  key={t}
                  className="bg-theme/10 text-theme rounded-md px-2 py-0.5 font-mono text-[11px]"
                >
                  {t}
                </span>
              ))}
              {p.workshopTags?.map((t) => (
                <span
                  key={`ws-${t}`}
                  className="rounded-md bg-emerald-600/15 px-2 py-0.5 font-mono text-[11px] text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                >
                  {t}
                </span>
              ))}
              {p.repoTags?.map((t) => (
                <span
                  key={`gh-${t}`}
                  className="rounded-md bg-emerald-600/15 px-2 py-0.5 font-mono text-[11px] text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                >
                  {t}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </li>
  )
}

function SimpleRow({
  p,
  flip,
  enterClass,
  delay,
}: {
  p: Project
  flip: boolean
  enterClass?: string
  delay?: number
}) {
  return (
    <li className={enterClass} style={{ animationDelay: `${delay ?? 0}ms` }}>
      <div
        className={`grid grid-cols-1 items-center gap-4 md:gap-8 ${
          flip
            ? "md:grid-cols-[minmax(min-content,1fr)_380px]"
            : "md:grid-cols-[380px_minmax(min-content,1fr)]"
        }`}
      >
        <Card
          className={`overflow-visible ${flip ? "md:order-1 md:text-right" : "md:order-2"}`}
        >
          <CardHeader className="!flex !grid-cols-none items-center justify-between gap-6">
            <CardTitle className="inline-flex items-center gap-2 text-xl leading-tight font-bold whitespace-nowrap lg:text-2xl">
              {p.link ? (
                <a
                  href={p.link}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 hover:underline"
                >
                  <span>{p.title}</span>
                  <FiExternalLink
                    className="text-theme h-4 w-4 shrink-0 opacity-80"
                    aria-hidden
                  />
                </a>
              ) : (
                <span>{p.title}</span>
              )}
            </CardTitle>
            <Text className="text-theme shrink-0 font-mono text-xs tracking-[0.3em] whitespace-nowrap uppercase">
              {p.year}
            </Text>
          </CardHeader>
          <CardContent>
            <Text className="max-w-prose text-sm leading-relaxed opacity-80">
              {p.blurb}
            </Text>
            {p.stats && (
              <div
                className={`mt-3 flex flex-wrap items-center gap-3 text-xs opacity-70 ${flip ? "md:justify-end" : ""}`}
              >
                {p.stats.subs != null && (
                  <span className="inline-flex items-center gap-1">
                    <FiUsers className="h-3.5 w-3.5" aria-hidden />
                    {formatCount(p.stats.subs)} subs
                  </span>
                )}
                {p.stats.favorites != null && (
                  <span className="inline-flex items-center gap-1">
                    <FiHeart className="h-3.5 w-3.5" aria-hidden />
                    {formatCount(p.stats.favorites)}
                  </span>
                )}
                {p.stats.views != null && (
                  <span className="inline-flex items-center gap-1">
                    <FiEye className="h-3.5 w-3.5" aria-hidden />
                    {formatCount(p.stats.views)}
                  </span>
                )}
              </div>
            )}
            <div
              className={`mt-4 flex flex-wrap gap-1.5 ${flip ? "md:justify-end" : ""}`}
            >
              {p.tags.map((t) => (
                <span
                  key={t}
                  className="bg-theme/10 text-theme rounded-md px-2 py-0.5 font-mono text-[11px]"
                >
                  {t}
                </span>
              ))}
              {p.workshopTags?.map((t) => (
                <span
                  key={`ws-${t}`}
                  className="rounded-md bg-emerald-600/15 px-2 py-0.5 font-mono text-[11px] text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                >
                  {t}
                </span>
              ))}
              {p.repoTags?.map((t) => (
                <span
                  key={`gh-${t}`}
                  className="rounded-md bg-emerald-600/15 px-2 py-0.5 font-mono text-[11px] text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                >
                  {t}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
        <div
          className={`hidden md:block ${flip ? "md:order-2" : "md:order-1"}`}
          aria-hidden
        />
      </div>
    </li>
  )
}

export default function Projects() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const enterKey = useEnterKey(sectionRef)
  const measureRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const [active, setActive] = useState<Category>("games")
  const [heights, setHeights] = useState<Record<string, number>>({})

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const onSet = (e: Event) => {
      const id = (e as CustomEvent).detail as Category
      if (CATEGORIES.some((c) => c.id === id)) setActive(id)
    }
    el.addEventListener("section-tab-set", onSet)
    return () => el.removeEventListener("section-tab-set", onSet)
  }, [])

  useEffect(() => {
    const observers: ResizeObserver[] = []
    for (const c of CATEGORIES) {
      const node = measureRefs.current[c.id]
      if (!node) continue
      const update = () => {
        setHeights((h) =>
          h[c.id] === node.scrollHeight
            ? h
            : { ...h, [c.id]: node.scrollHeight }
        )
      }
      update()
      const ro = new ResizeObserver(update)
      ro.observe(node)
      observers.push(ro)
    }
    return () => observers.forEach((o) => o.disconnect())
  }, [])

  const tabsWithHeight = CATEGORIES.map((c) => ({
    ...c,
    height: heights[c.id] ?? 0,
  }))

  const onPointerDown = (e: React.PointerEvent<HTMLElement>) => {
    const sc = scrollRef.current
    if (!sc) return
    if (e.pointerType === "mouse" && e.button !== 0) return
    if (e.pointerType === "touch") return
    // Let interactive elements (image lightbox button, title link) handle
    // their own clicks instead of starting a grab-to-scroll drag.
    if ((e.target as HTMLElement).closest("button, a")) return
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
      data-section-tabs={JSON.stringify(tabsWithHeight)}
      data-active-tab={active}
      onPointerDown={onPointerDown}
      className="relative flex h-svh w-full cursor-grab flex-col items-center px-20 active:cursor-grabbing md:px-24"
    >
      <div className="relative min-h-0 w-full max-w-7xl flex-1">
        <div
          ref={scrollRef}
          data-scrollable
          className="no-scrollbar h-full w-full overflow-y-auto"
        >
          <div
            key={`proj-${enterKey}`}
            className={`flex flex-col gap-6 pt-[15vh] pb-[25vh] ${enterKey === 0 ? "opacity-0" : ""}`}
          >
            <Tabs
              value={active}
              onValueChange={(v) => setActive(v as Category)}
              className="mx-auto w-full max-w-4xl"
            >
              <TabsList variant="line" className="mx-auto">
                {CATEGORIES.map((c) => (
                  <TabsTrigger key={c.id} value={c.id}>
                    {c.label}
                  </TabsTrigger>
                ))}
              </TabsList>
              {CATEGORIES.map((c) => {
                const items = projects.filter((p) => p.category === c.id)
                return (
                  <TabsContent key={c.id} value={c.id} className="mt-16">
                    <ol className="flex w-full flex-col gap-8">
                      {items.map((p, i) => (
                        <ProjectRow
                          key={p.title}
                          p={p}
                          flip={i % 2 === 1}
                          enterClass={
                            i % 2 === 1
                              ? "enter-slide-left"
                              : "enter-slide-right"
                          }
                          delay={i * 90}
                        />
                      ))}
                    </ol>
                  </TabsContent>
                )
              })}
            </Tabs>
          </div>
          <div
            aria-hidden
            className="pointer-events-none invisible absolute top-0 left-0 -z-10 w-full"
          >
            {CATEGORIES.map((c) => {
              const items = projects.filter((p) => p.category === c.id)
              return (
                <div
                  key={c.id}
                  ref={(el) => {
                    measureRefs.current[c.id] = el
                  }}
                  className="mx-auto w-full max-w-5xl pt-[15vh] pb-[25vh]"
                >
                  <ol className="mt-6 flex w-full flex-col gap-8">
                    {items.map((p, i) => (
                      <ProjectRow key={p.title} p={p} flip={i % 2 === 1} />
                    ))}
                  </ol>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
