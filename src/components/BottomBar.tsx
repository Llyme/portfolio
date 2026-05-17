import { FaGithub, FaItchIo, FaLinkedin } from "react-icons/fa"
import Anchor from "./AnchorIcon"

export default function BottomBar() {
  return (
    <div className="absolute right-12 bottom-6 left-12 flex justify-end gap-6">
      <Anchor tooltip="GitHub" link="https://github.com/Llyme" tab>
        <FaGithub className="h-full w-full" />
      </Anchor>
      <Anchor
        tooltip="LinkedIn"
        link="https://www.linkedin.com/in/wong-me/"
        tab
      >
        <FaLinkedin className="h-full w-full" />
      </Anchor>
      <Anchor tooltip="itch.io" link="https://misternyan.itch.io/" tab>
        <FaItchIo className="h-full w-full" />
      </Anchor>
    </div>
  )
}
