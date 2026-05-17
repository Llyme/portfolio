import Text from "@/components/Text"
import VerticalTextMarquee from "./VerticalTextMarquee"

export default function CoolIntro() {
  return (
    <div className="flex h-svh flex-col items-center justify-center gap-7 overflow-hidden select-none">
      <Text className="z-1 text-center text-7xl">
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
          ]}
        />
      </Text>
    </div>
  )
}
