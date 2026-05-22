import { useEffect, useState, type RefObject } from "react"

export function useEnterKey(ref: RefObject<HTMLElement | null>) {
  const [key, setKey] = useState(0)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const slide = el.closest("[data-slot=carousel-item]")
    const parent = slide?.parentElement
    const myIndex = slide && parent ? Array.from(parent.children).indexOf(slide) : -1

    const onSnap = (e: Event) => {
      const i = (e as CustomEvent).detail as number
      if (i === myIndex) setKey((k) => k + 1)
    }
    window.addEventListener("snap-change", onSnap)

    return () => {
      window.removeEventListener("snap-change", onSnap)
    }
  }, [ref])
  return key
}
