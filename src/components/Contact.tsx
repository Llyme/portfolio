import { useRef } from "react"
import Anchor from "./AnchorIcon"
import { socials } from "@/constants/socials"
import { useEnterKey } from "@/hooks/useEnterKey"

function Typewriter({
  text,
  themeFrom,
  themeTo,
  className,
  charMs = 80,
}: {
  text: string
  themeFrom?: number
  themeTo?: number
  className?: string
  charMs?: number
}) {
  const chars = Array.from(text)
  return (
    <span className={`typewriter ${className ?? ""}`}>
      {chars.map((c, i) => {
        const themed =
          themeFrom != null && themeTo != null && i >= themeFrom && i < themeTo
        return (
          <span
            key={i}
            className={themed ? "text-theme" : undefined}
            style={{ animationDelay: `${i * charMs}ms` }}
          >
            {c === " " ? " " : c}
          </span>
        )
      })}
    </span>
  )
}

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null)
  const enterKey = useEnterKey(sectionRef)
  return (
    <section
      ref={sectionRef}
      className="flex min-h-svh w-full flex-col items-center justify-center gap-10 px-8 py-24"
    >
      <div
        key={`contact-${enterKey}`}
        className={`flex flex-col items-center gap-10 ${enterKey === 0 ? "opacity-0" : ""}`}
      >
        <Typewriter
          text="Contact me."
          themeFrom={8}
          themeTo={10}
          className="text-4xl lg:text-6xl"
        />
        <div className="flex gap-6">
          {socials.map((s) => (
            <Anchor
              key={s.tooltip}
              tooltip={s.tooltip}
              link={s.link}
              tab={s.tab}
            >
              <s.Icon className="h-full w-full" />
            </Anchor>
          ))}
        </div>
      </div>
    </section>
  )
}
