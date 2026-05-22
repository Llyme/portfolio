import {
  SiReact,
  SiVuedotjs,
  SiNodedotjs,
  SiTypescript,
  SiPython,
  SiPostgresql,
  SiMongodb,
  SiRedis,
  SiDocker,
  SiKubernetes,
  SiLinux,
  SiTailwindcss,
  SiFastapi,
  SiGit,
  SiOpenai,
  SiOllama,
  SiUnity,
  SiBlender,
  SiPandas,
  SiApachespark,
  SiVite,
  SiHtml5,
  SiNextdotjs,
  SiSqlite,
  SiLua,
  SiApacheairflow,
  SiClojure,
  SiGithubactions,
  SiCircleci,
} from "react-icons/si"
import { FaJava } from "react-icons/fa"
import { TbBrandCSharp } from "react-icons/tb"
import type { IconType } from "react-icons"

export type SkillGroup =
  | "backend"
  | "data"
  | "frontend"
  | "devops"
  | "gamedev"
  | "ai"

export type Skill = {
  name: string
  Icon: IconType
  color: string
  mono?: boolean
  groups: SkillGroup[]
}

export const SKILL_GROUPS: { id: SkillGroup; label: string }[] = [
  { id: "backend", label: "Backend" },
  { id: "data", label: "Data Engineer" },
  { id: "ai", label: "AI Engineer" },
  { id: "frontend", label: "Frontend" },
  { id: "devops", label: "DevOps" },
  { id: "gamedev", label: "Gamedev" },
]

export const skills: Skill[] = [
  { name: "React", Icon: SiReact, color: "#61DAFB", groups: ["frontend"] },
  { name: "Vue", Icon: SiVuedotjs, color: "#41B883", groups: ["frontend"] },
  {
    name: "Node.js",
    Icon: SiNodedotjs,
    color: "#5FA04E",
    groups: ["backend", "frontend"],
  },
  {
    name: "TypeScript",
    Icon: SiTypescript,
    color: "#3178C6",
    groups: ["frontend", "backend"],
  },
  {
    name: "Python",
    Icon: SiPython,
    color: "#3776AB",
    groups: ["backend", "data", "ai"],
  },
  { name: "Java", Icon: FaJava, color: "#E76F00", groups: ["backend"] },
  {
    name: "PostgreSQL",
    Icon: SiPostgresql,
    color: "#4169E1",
    groups: ["backend", "data"],
  },
  {
    name: "MongoDB",
    Icon: SiMongodb,
    color: "#47A248",
    groups: ["backend", "data"],
  },
  { name: "Redis", Icon: SiRedis, color: "#DC382D", groups: ["backend"] },
  {
    name: "Docker",
    Icon: SiDocker,
    color: "#2496ED",
    groups: ["devops", "backend"],
  },
  {
    name: "Kubernetes",
    Icon: SiKubernetes,
    color: "#326CE5",
    groups: ["devops"],
  },
  {
    name: "Linux",
    Icon: SiLinux,
    color: "#000000",
    mono: true,
    groups: ["devops", "backend"],
  },
  {
    name: "Tailwind",
    Icon: SiTailwindcss,
    color: "#06B6D4",
    groups: ["frontend"],
  },
  { name: "FastAPI", Icon: SiFastapi, color: "#009688", groups: ["backend", "ai"] },
  {
    name: "Git",
    Icon: SiGit,
    color: "#F05032",
    groups: ["backend", "frontend", "data", "devops", "gamedev"],
  },
  {
    name: "OpenAI",
    Icon: SiOpenai,
    color: "#000000",
    mono: true,
    groups: ["ai"],
  },
  {
    name: "Ollama",
    Icon: SiOllama,
    color: "#000000",
    mono: true,
    groups: ["ai"],
  },
  {
    name: "Unity",
    Icon: SiUnity,
    color: "#000000",
    mono: true,
    groups: ["gamedev"],
  },
  { name: "Blender", Icon: SiBlender, color: "#E87D0D", groups: ["gamedev"] },
  {
    name: "pandas",
    Icon: SiPandas,
    color: "#000000",
    mono: true,
    groups: ["data", "ai"],
  },
  { name: "Spark", Icon: SiApachespark, color: "#E25A1C", groups: ["data", "ai"] },
  { name: "Vite", Icon: SiVite, color: "#646CFF", groups: ["frontend"] },
  { name: "HTML5", Icon: SiHtml5, color: "#E34F26", groups: ["frontend"] },
  {
    name: "Next.js",
    Icon: SiNextdotjs,
    color: "#000000",
    mono: true,
    groups: ["frontend"],
  },
  {
    name: "SQLite",
    Icon: SiSqlite,
    color: "#000000",
    mono: true,
    groups: ["backend", "data"],
  },
  {
    name: "Lua",
    Icon: SiLua,
    color: "#000000",
    mono: true,
    groups: ["gamedev"],
  },
  {
    name: "Airflow",
    Icon: SiApacheairflow,
    color: "#017CEE",
    groups: ["data"],
  },
  { name: "Clojure", Icon: SiClojure, color: "#5881D8", groups: ["backend"] },
  {
    name: "C#",
    Icon: TbBrandCSharp,
    color: "#9B4F96",
    groups: ["gamedev", "backend"],
  },
  {
    name: "GitHub Actions",
    Icon: SiGithubactions,
    color: "#2088FF",
    groups: ["devops"],
  },
  {
    name: "CI/CD",
    Icon: SiCircleci,
    color: "#000000",
    mono: true,
    groups: ["devops"],
  },
]
