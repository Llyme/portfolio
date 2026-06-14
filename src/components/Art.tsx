import { Suspense, lazy, useRef } from "react"
import { BsBadge3dFill } from "react-icons/bs"
import Text from "@/components/Text"
import { useEnterKey } from "@/hooks/useEnterKey"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

const ModelViewer = lazy(() => import("./ModelViewer"))

const BASE = import.meta.env.BASE_URL
const ENV = `${BASE}models/studio.hdr`

type ArtPiece = {
  title: string
  blurb: string
  poster: string
  model: string
  cameraTarget?: string
  cameraOrbit?: string
  credit?: string
}

const pieces: ArtPiece[] = [
  {
    title: "College Project 1",
    blurb: "Fan art study — Dishonored © Arkane Studios / Bethesda.",
    poster: `${BASE}models/dishonored.webp`,
    model: `${BASE}models/dishonored.glb`,
  },
  {
    title: "College Project 2",
    blurb: "Modeled and rendered in Blender.",
    poster: `${BASE}models/chess.webp`,
    model: `${BASE}models/chess.glb`,
  },
  {
    title: "College Project 3",
    blurb: "Modeled and rendered in Blender.",
    poster: `${BASE}models/still.webp`,
    model: `${BASE}models/still.glb`,
  },
]

function ArtCard({ piece, delay }: { piece: ArtPiece; delay: number }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className="group mx-auto flex w-full max-w-[18rem] flex-col gap-3 outline-none focus-visible:outline-none"
          style={{ ["--delay" as string]: `${delay}ms` }}
        >
          <div className="relative aspect-square w-full cursor-zoom-in rounded-lg">
            <div className="spotlight-beam" aria-hidden />
            <div className="relative h-full w-full overflow-hidden rounded-lg bg-gradient-to-br from-zinc-700 to-zinc-900 shadow">
              <img
                src={piece.poster}
                alt={piece.title}
                loading="lazy"
                className="h-full w-full object-cover transition group-hover:scale-105"
              />
              <div className="spotlight-shade-l" aria-hidden />
              <div className="spotlight-shade-r" aria-hidden />
              <div className="spotlight-blackout" aria-hidden />
              <BsBadge3dFill
                className="text-theme absolute right-2 bottom-2 h-6 w-6 drop-shadow-[0_1px_2px_rgba(0,0,0,0.7)]"
                aria-label="View in 3D"
              />
            </div>
          </div>
          <div className="text-center">
            <Text className="block text-sm">{piece.title}</Text>
            <Text className="mt-1 block text-xs opacity-60">{piece.blurb}</Text>
          </div>
        </button>
      </DialogTrigger>
      <DialogContent className="w-[92vw] max-w-[92vw] border-none bg-transparent p-0 ring-0 sm:max-w-[92vw]">
        <DialogTitle className="sr-only">{piece.title}</DialogTitle>
        <div className="h-[85vh] w-full">
          <Suspense
            fallback={
              <div className="flex h-full w-full items-center justify-center font-mono text-sm opacity-60">
                Loading model…
              </div>
            }
          >
            <ModelViewer
              src={piece.model}
              poster={piece.poster}
              alt={piece.title}
              cameraTarget={piece.cameraTarget}
              cameraOrbit={piece.cameraOrbit}
              environmentImage={ENV}
            />
          </Suspense>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default function Art() {
  const sectionRef = useRef<HTMLElement>(null)
  const enterKey = useEnterKey(sectionRef)
  return (
    <section
      ref={sectionRef}
      className="flex min-h-svh w-full flex-col items-center justify-center gap-12 px-8 py-24"
    >
      <div
        key={`art-${enterKey}`}
        className={`flex w-full max-w-5xl flex-col items-center gap-8 ${enterKey === 0 ? "opacity-0" : ""}`}
      >
        <div className="grid w-full grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6">
          {pieces.map((p, i) => (
            <ArtCard key={p.title} piece={p} delay={i * 280} />
          ))}
        </div>
      </div>
    </section>
  )
}
