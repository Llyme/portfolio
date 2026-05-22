import {
  FaGithub,
  FaLinkedin,
  FaItchIo,
  FaSteam,
  FaEnvelope,
} from "react-icons/fa"
import type { IconType } from "react-icons"

export type Social = {
  tooltip: string
  link: string
  Icon: IconType
  tab?: boolean
}

export const socials: Social[] = [
  {
    tooltip: "Email",
    link: "mailto:michael.edmund.wong@gmail.com",
    Icon: FaEnvelope,
    tab: true,
  },
  {
    tooltip: "GitHub",
    link: "https://github.com/Llyme",
    Icon: FaGithub,
    tab: true,
  },
  {
    tooltip: "LinkedIn",
    link: "https://www.linkedin.com/in/wong-me/",
    Icon: FaLinkedin,
    tab: true,
  },
  {
    tooltip: "itch.io",
    link: "https://misternyan.itch.io/",
    Icon: FaItchIo,
    tab: true,
  },
  {
    tooltip: "Steam Workshop",
    link: "https://steamcommunity.com/profiles/76561198068121667/myworkshopfiles/",
    Icon: FaSteam,
    tab: true,
  },
]
