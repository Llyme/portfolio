import Text from "@/components/Text"
import VerticalTextMarquee from "./VerticalTextMarquee"
import Anchor from "./AnchorIcon"
import { socials } from "@/constants/socials"

export default function CoolIntro() {
  return (
    <div className="fade relative h-svh items-center justify-between gap-7 overflow-hidden select-none">
      <Text className="absolute top-1/2 left-0 z-1 w-full -translate-y-1/2 px-6 py-16 text-center text-2xl sm:p-16 sm:text-3xl lg:text-7xl">
        Hi, I'm <Text className="text-theme">Michael</Text>,{" "}
        <VerticalTextMarquee
          className="text-left"
          items={[
            <>
              a <Text className="text-theme">Backend Developer</Text>.
            </>,
            <>
              a <Text className="text-theme">Frontend Developer</Text>.
            </>,
            <>
              a <Text className="text-theme">Data Engineer</Text>.
            </>,
            <>
              an <Text className="text-theme">AI Engineer</Text>.
            </>,
            <>
              a <Text className="text-theme">Game Developer</Text>.
            </>,
            <>
              a <Text className="text-theme">DevOps Engineer</Text>.
            </>,
          ]}
        />
      </Text>
      <div className="absolute bottom-0 z-10 flex w-full items-center justify-center gap-6 px-6 pb-16 sm:justify-end sm:px-12">
        <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
          {socials.map((s) => (
            <Anchor
              key={s.tooltip}
              tooltip={s.tooltip}
              link={s.link}
              tab={s.tab}
              className="h-7 w-7 sm:h-8 sm:w-8"
            >
              <s.Icon className="h-full w-full" />
            </Anchor>
          ))}
        </div>
      </div>
    </div>
  )
}
