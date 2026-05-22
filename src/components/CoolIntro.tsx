import Text from "@/components/Text"
import VerticalTextMarquee from "./VerticalTextMarquee"
import Anchor from "./AnchorIcon"
import { socials } from "@/constants/socials"

export default function CoolIntro() {
  return (
    <div className="fade relative h-svh items-center justify-between gap-7 overflow-hidden select-none">
      <Text className="absolute top-1/2 left-0 z-1 w-full -translate-y-1/2 p-16 text-center text-3xl lg:text-7xl">
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
      <div className="absolute bottom-0 flex w-full flex-0 items-center justify-end gap-6 px-12 pb-6">
        <div className="flex flex-0 gap-6">
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
    </div>
  )
}
