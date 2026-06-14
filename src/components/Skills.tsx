import { useEffect, useMemo, useRef, useState } from "react"
import Matter from "matter-js"
import Text from "@/components/Text"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { skills, SKILL_GROUPS, type SkillGroup } from "@/constants/skills"
import { useEnterKey } from "@/hooks/useEnterKey"

function SparkBurst({
  x,
  y,
  size,
  color,
  onDone,
}: {
  x: number
  y: number
  size: number
  color?: string
  onDone: () => void
}) {
  const sparksRef = useRef<{ angle: number; len: number; dur: number }[]>(
    Array.from({ length: 12 }, () => ({
      angle: Math.random() * 360,
      len: size * (0.08 + Math.random() * 0.32),
      dur: 600 + Math.random() * 500,
    }))
  )
  useEffect(() => {
    const t = window.setTimeout(onDone, 1300)
    return () => clearTimeout(t)
  }, [onDone])
  return (
    <div
      className="pointer-events-none absolute"
      style={{ left: x, top: y, width: 0, height: 0 }}
    >
      {sparksRef.current.map((s, i) => (
        <span
          key={i}
          className="spark"
          style={
            {
              "--a": `${s.angle}deg`,
              "--len": `${s.len}px`,
              "--start": `${size / 2}px`,
              "--dur": `${s.dur}ms`,
              ...(color ? { "--c": color } : {}),
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  )
}

function computeBallSize(w: number) {
  if (w < 640) return 40
  if (w < 1024) return 80
  return 110
}

export default function Skills() {
  const containerRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const firstInitRef = useRef(true)
  const ballRefs = useRef<(HTMLDivElement | null)[]>([])
  const bodiesRef = useRef<Matter.Body[]>([])
  const [ballSize, setBallSize] = useState(() =>
    typeof window === "undefined" ? 110 : computeBallSize(window.innerWidth)
  )
  const [group, setGroup] = useState<SkillGroup>("backend")
  const [sparks, setSparks] = useState<
    { id: string; x: number; y: number; color?: string }[]
  >([])
  const enterKey = useEnterKey(sectionRef)
  const filteredSkills = useMemo(
    () => skills.filter((s) => s.groups.includes(group)),
    [group]
  )

  useEffect(() => {
    const onResize = () => setBallSize(computeBallSize(window.innerWidth))
    window.addEventListener("resize", onResize)
    return () => window.removeEventListener("resize", onResize)
  }, [])

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const onSet = (e: Event) => {
      const id = (e as CustomEvent).detail as SkillGroup
      if (SKILL_GROUPS.some((g) => g.id === id)) setGroup(id)
    }
    el.addEventListener("section-tab-set", onSet)
    return () => el.removeEventListener("section-tab-set", onSet)
  }, [])


  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const { Engine, World, Bodies, Body, Mouse, MouseConstraint } = Matter

    let cleanup: (() => void) | null = null

    const init = (width: number, height: number) => {
      const engine = Engine.create({
        positionIterations: 10,
        velocityIterations: 10,
      })
      engine.gravity.y = 1
      const world = engine.world

      const WALL = 200
      const wallOpts = { isStatic: true, render: { visible: false } }
      const walls = [
        Bodies.rectangle(
          width / 2,
          height + WALL / 2,
          width * 4,
          WALL,
          wallOpts
        ),
        Bodies.rectangle(-WALL / 2, height / 2, WALL, height * 4, wallOpts),
        Bodies.rectangle(
          width + WALL / 2,
          height / 2,
          WALL,
          height * 4,
          wallOpts
        ),
        Bodies.rectangle(width / 2, -WALL / 2, width * 4, WALL, wallOpts),
      ]
      World.add(world, walls)

      const radius = ballSize / 2
      const bodies = filteredSkills.map(() => {
        const b = Bodies.circle(
          radius + Math.random() * Math.max(1, width - ballSize),
          radius + Math.random() * Math.max(1, height - ballSize),
          radius,
          {
            restitution: 0.5,
            friction: 0.05,
            frictionAir: 0.01,
            density: 0.002,
          }
        )
        Body.setVelocity(b, {
          x: (Math.random() - 0.5) * 16,
          y: (Math.random() - 0.5) * 12,
        })
        Body.setAngularVelocity(b, (Math.random() - 0.5) * 0.4)
        return b
      })
      World.add(world, bodies)
      bodiesRef.current = bodies
      if (firstInitRef.current) {
        firstInitRef.current = false
      } else {
        const stamp = Date.now()
        setSparks(
          bodies.map((b, i) => ({
            id: `${stamp}-${i}`,
            x: b.position.x,
            y: b.position.y,
            color: filteredSkills[i]?.mono
              ? "currentColor"
              : filteredSkills[i]?.color,
          }))
        )
      }

      const mouse = Mouse.create(container)
      const mouseConstraint = MouseConstraint.create(engine, {
        mouse,
        constraint: { stiffness: 0.2, render: { visible: false } },
      })
      World.add(world, mouseConstraint)

      let rafId = 0
      let last = performance.now()
      const MAX_V = 30
      const tick = (now: number) => {
        const dt = Math.min(32, now - last)
        last = now
        for (const b of bodies) {
          const vx = b.velocity.x
          const vy = b.velocity.y
          const s = Math.hypot(vx, vy)
          if (s > MAX_V) {
            Body.setVelocity(b, { x: (vx / s) * MAX_V, y: (vy / s) * MAX_V })
          }
        }
        Engine.update(engine, dt)
        for (let i = 0; i < bodies.length; i++) {
          const b = bodies[i]
          const el = ballRefs.current[i]
          if (!el) continue
          el.style.transform = `translate(${b.position.x - radius}px, ${b.position.y - radius}px) rotate(${b.angle}rad)`
        }
        rafId = requestAnimationFrame(tick)
      }
      rafId = requestAnimationFrame(tick)

      let w = width
      let h = height
      const ro = new ResizeObserver(() => {
        const nw = container.clientWidth
        const nh = container.clientHeight
        if (nw === w && nh === h) return
        w = nw
        h = nh
        Body.setPosition(walls[0], { x: w / 2, y: h + 100 })
        Body.setPosition(walls[1], { x: -100, y: h / 2 })
        Body.setPosition(walls[2], { x: w + 100, y: h / 2 })
        Body.setPosition(walls[3], { x: w / 2, y: -100 })
        bodies.forEach((b) => {
          if (b.position.x > w || b.position.y > h || b.position.x < 0) {
            Body.setPosition(b, {
              x: radius + Math.random() * Math.max(1, w - ballSize),
              y: radius,
            })
            Body.setVelocity(b, { x: 0, y: 0 })
          }
        })
      })
      ro.observe(container)

      cleanup = () => {
        cancelAnimationFrame(rafId)
        ro.disconnect()
        World.clear(world, false)
        Engine.clear(engine)
      }
    }

    const waitForSize = () => {
      const w = container.clientWidth
      const h = container.clientHeight
      if (w > 0 && h > 0) {
        init(w, h)
        return
      }
      const ro = new ResizeObserver(() => {
        const w2 = container.clientWidth
        const h2 = container.clientHeight
        if (w2 > 0 && h2 > 0) {
          ro.disconnect()
          init(w2, h2)
        }
      })
      ro.observe(container)
      cleanup = () => ro.disconnect()
    }
    waitForSize()

    return () => {
      cleanup?.()
    }
  }, [ballSize, filteredSkills])

  return (
    <section
      ref={sectionRef}
      className="relative h-svh w-full"
      data-section-tabs={JSON.stringify(SKILL_GROUPS)}
      data-active-tab={group}
    >
      <div
        key={`text-${enterKey}-${group}`}
        className={`pointer-events-none absolute top-[55%] left-1/2 z-10 w-[92vw] max-w-3xl -translate-x-1/2 -translate-y-1/2 px-4 text-center sm:px-8 ${enterKey === 0 ? "opacity-0" : "section-enter"}`}
      >
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-sm font-semibold sm:gap-x-6 sm:gap-y-5 sm:text-2xl lg:gap-x-8 lg:gap-y-6 lg:text-3xl">
          {filteredSkills.map((s) => (
            <span
              key={s.name}
              className="inline-flex items-center gap-1.5 rounded-full bg-white/60 px-2.5 py-1 backdrop-blur-sm sm:gap-2 sm:px-4 sm:py-1.5 dark:bg-black/50"
            >
              <s.Icon
                className="h-4 w-4 sm:h-7 sm:w-7 lg:h-8 lg:w-8"
                style={{ color: s.mono ? undefined : s.color }}
              />
              <Text>{s.name}</Text>
            </span>
          ))}
        </div>
      </div>
      <div
        key={`tabs-${enterKey}`}
        className={`absolute top-[13vh] left-1/2 z-20 w-[92vw] max-w-3xl -translate-x-1/2 ${enterKey === 0 ? "opacity-0" : "section-enter"}`}
      >
        <Tabs
          value={group}
          onValueChange={(v) => setGroup(v as SkillGroup)}
          data-no-drag
        >
          <TabsList variant="line" className="mx-auto flex-wrap justify-center">
            {SKILL_GROUPS.map((g) => (
              <TabsTrigger key={g.id} value={g.id} className="flex-none">
                {g.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
      <div
        ref={containerRef}
        className="absolute inset-0 overflow-hidden"
        style={{ touchAction: "none" }}
      >
        <TooltipProvider delayDuration={150}>
          {filteredSkills.map((s, i) => (
            <Tooltip key={`${group}-${s.name}`}>
              <TooltipTrigger asChild>
                <div
                  ref={(el) => {
                    ballRefs.current[i] = el
                  }}
                  data-no-drag
                  className="absolute top-0 left-0 flex items-center justify-center rounded-full border border-black bg-white text-black select-none dark:border-white dark:bg-black dark:text-white"
                  style={{
                    width: ballSize,
                    height: ballSize,
                    willChange: "transform",
                  }}
                >
                  <s.Icon
                    style={{
                      color: s.mono ? undefined : s.color,
                      width: ballSize * 0.5,
                      height: ballSize * 0.5,
                    }}
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent side="top">{s.name}</TooltipContent>
            </Tooltip>
          ))}
        </TooltipProvider>
        {sparks.map((sp) => (
          <SparkBurst
            key={sp.id}
            x={sp.x}
            y={sp.y}
            size={ballSize}
            color={sp.color}
            onDone={() => setSparks((cur) => cur.filter((c) => c.id !== sp.id))}
          />
        ))}
      </div>
    </section>
  )
}
