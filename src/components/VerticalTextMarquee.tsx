import Text from "@/components/Text"
import { cn } from "@/lib/utils"
import { useEffect, useRef, useState } from "react"

function setOpacity(
  items: HTMLDivElement[],
  index: number,
  transition: boolean,
  speed: number
) {
  for (let i = 0; i < items.length; i++) {
    const el = items[i]

    el.style.transition = transition
      ? `opacity ${speed}ms linear, filter ${speed}ms linear`
      : "none"
    el.style.opacity = i === index ? "1" : "0.1"
    el.style.filter = i === index ? "blur(0px)" : "blur(3px)"
  }
}

export default function VerticalTextMarquee({
  items,
  className,
  delay = 2800,
  moveSpeed = 300,
  opacitySpeed = 100,
}: {
  items: React.ReactNode[]
  className?: string
  delay?: number
  moveSpeed?: number
  opacitySpeed?: number
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const itemRefs = useRef<HTMLDivElement[]>([])
  const indexRef = useRef(0)
  const isPausedRef = useRef(false)

  //   const repeatCountRef = useRef(3)
  const [repeatCount, setRepeatCount] = useState(3)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const track = container.children[0] as HTMLElement
    const base = items.length

    let itemHeight = 0

    const measure = () => {
      const first = track.children[0] as HTMLElement
      if (!first) return
      itemHeight = first.getBoundingClientRect().height
    }
    const computeRepeats = () => {
      const containerHeight = container.clientHeight || window.innerHeight
      const singleSetHeight = itemHeight * base

      const needed = Math.ceil((containerHeight * 3) / singleSetHeight)
      const value = Math.max(3, needed)

      setRepeatCount(value)

      return value
    }

    const setup = () => {
      measure()
      const repeatCount = computeRepeats()

      indexRef.current = base * Math.floor(repeatCount / 2)

      track.style.transition = "none"
      track.style.transform = `translateY(-${indexRef.current * itemHeight}px)`

      setOpacity(itemRefs.current, indexRef.current, false, opacitySpeed)
    }

    setup()

    window.addEventListener("resize", setup)

    const step = () => {
      if (isPausedRef.current) return

      indexRef.current = indexRef.current + 1

      setOpacity(itemRefs.current, indexRef.current, true, opacitySpeed)

      track.style.transition = `transform ${moveSpeed}ms ease-in-out`
      track.style.transform = `translateY(-${indexRef.current * itemHeight}px)`

      // seamless reset when reaching end buffer
      if (indexRef.current % base == 0) {
        setTimeout(() => {
          track.style.transition = "none"

          indexRef.current =
            base * Math.floor(repeatCount / 2) + (indexRef.current % base)

          track.style.transform = `translateY(-${
            indexRef.current * itemHeight
          }px)`

          setOpacity(itemRefs.current, indexRef.current, false, opacitySpeed)
        }, moveSpeed)
      }

      isPausedRef.current = true

      setTimeout(() => {
        isPausedRef.current = false
        step()
      }, delay)
    }

    const start = setTimeout(step, 800)

    return () => {
      clearTimeout(start)
      window.removeEventListener("resize", setup)
    }
  }, [delay, items.length, moveSpeed, opacitySpeed, repeatCount])

  return (
    <div ref={containerRef} className={cn("inline-block h-0", className)}>
      <div className="flex flex-col">
        {Array.from({ length: repeatCount })
          .flatMap(() => items)
          .map((text, i) => (
            <div
              key={i}
              ref={(el) => {
                if (el) itemRefs.current[i] = el
              }}
            >
              <Text>{text}</Text>
            </div>
          ))}
      </div>
    </div>
  )
}
