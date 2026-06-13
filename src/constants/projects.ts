import workshop from "@/constants/workshop.json"
import itch from "@/constants/itch.json"
import github from "@/constants/github.json"

export type Category = "mods" | "games" | "tools" | "packages"

export type Project = {
  title: string
  year: string
  blurb: string
  tags: string[]
  image?: string
  link?: string
  category: Category
  simple?: boolean
  stats?: { subs?: number; favorites?: number; views?: number }
  workshopTags?: string[]
  repoTags?: string[]
}

const APP_TAGS: Record<string, string[]> = {
  RimWorld: ["C#", "RimWorld", "Modding"],
  Starbound: ["Lua", "Starbound", "Modding"],
}

function truncate(s: string, n: number) {
  const clean = s.replace(/\s+/g, " ").trim()
  return clean.length > n ? clean.slice(0, n - 1).trimEnd() + "…" : clean
}

const steamProjects: Project[] = workshop.map((w) => ({
  title: w.title,
  year: new Date(w.created * 1000).getUTCFullYear().toString(),
  blurb: truncate(w.description, 160),
  tags: APP_TAGS[w.app] ?? [w.app, "Modding"],
  workshopTags: (w.tags ?? []).filter(Boolean),
  image: w.preview,
  link: w.url,
  category: "mods",
  stats: {
    subs: w.subscriptions,
    favorites: w.favorites,
    views: w.views,
  },
}))

const PILLAR_MAGE_ID = "2221169"
const PILLAR_MAGE_YEAR = "2023"
const PILLAR_MAGE_TITLE = "Pillar Mage"

const itchProjects: Project[] = itch.map((g) => ({
  title: g.id === PILLAR_MAGE_ID ? g.title || PILLAR_MAGE_TITLE : g.title,
  year: g.id === PILLAR_MAGE_ID ? PILLAR_MAGE_YEAR : "",
  blurb: g.description,
  tags: [g.genre, ...g.platforms, "Unity"].filter(Boolean),
  image: g.image,
  link: g.url,
  category: "games",
}))

const staticProjects: Project[] = [
  {
    title: "Point-of-Sale System",
    year: "2023",
    blurb:
      "Modular Electron point-of-sale system with role-based auth, product/menu and order management, payment handling and audit logging — backed by an encrypted SQLite store, with reusable in-app UI modules (calculator, context menu, file explorer) and serial-port device integration.",
    tags: ["Electron", "SQLite", "Node.js"],
    category: "tools",
    simple: true,
  },
  {
    title: "Engineering Intelligence Platform",
    year: "2025",
    blurb:
      "Full-stack platform that ingests git history, commits and issue-tracker data into MongoDB/Elasticsearch, runs a lane-based analysis engine over it, and surfaces contributor insights through dashboards with collaboration graphs, heatmaps and AI-generated summaries.",
    tags: [
      "FastAPI",
      "Next.js",
      "MongoDB",
      "Elasticsearch",
      "Ollama",
      "Microservices",
    ],
    category: "tools",
    simple: true,
  },
  {
    title: "Scheduled Analytics Engine",
    year: "2025",
    blurb:
      "Distributed engine that runs user-defined analysis plans on configurable intervals, computing time-windowed statistics over large datasets with Spark, gRPC services and a monorepo web UI for defining plans and viewing results.",
    tags: ["PySpark", "gRPC", "Next.js", "MongoDB", "Turborepo"],
    category: "tools",
    simple: true,
  },
  {
    title: "Multi-Tenant LLM Gateway",
    year: "2025",
    blurb:
      "Led the team building a self-hosted gateway around a local LLM — per-user accounts, API keys, usage tracking and an admin dashboard, fronted by a React chat UI and backed by Postgres with migrations.",
    tags: ["FastAPI", "Ollama", "PostgreSQL", "React", "Alembic"],
    category: "tools",
    simple: true,
  },
  {
    title: "Mongo ↔ Elasticsearch Sync Pipeline",
    year: "2025",
    blurb:
      "Distributed data-sync microservice keeping MongoDB stores and Elasticsearch indexes consistent with atomic transactions, Redis-backed coordination, rate limiting, error recovery and OpenTelemetry observability.",
    tags: ["Python", "Elasticsearch", "Redis", "OpenTelemetry"],
    category: "tools",
    simple: true,
  },
  {
    title: "Content Virality Scoring Pipeline",
    year: "2025",
    blurb:
      "Built the scoring calculator for a data pipeline that enriches content with virality and traffic-rank metrics — score matrices and kinematics-based virality models feeding downstream syncing into MongoDB and Elasticsearch.",
    tags: ["Python", "MongoDB", "Elasticsearch", "Pipelines"],
    category: "tools",
    simple: true,
  },
  {
    title: "Cross-Platform Media Downloader",
    year: "2025",
    blurb:
      "Built the backend for a desktop app that downloads media from a wide range of sites via yt-dlp/ffmpeg — batch downloads, format selection, library management and background processing.",
    tags: ["Electron", "yt-dlp", "TypeScript", "Node.js"],
    category: "tools",
    simple: true,
  },
  ...github
    .filter((g) => g.slug === "Llyme/Kunoichi")
    .map<Project>((g) => ({
      title: "Kunoichi Schedule Sim",
      year: new Date(g.createdAt).getUTCFullYear().toString(),
      blurb: g.description,
      tags: ["Electron"],
      repoTags: [...g.languages, g.license].filter(Boolean),
      link: g.url,
      category: "tools",
    })),
]

const packageProjects: Project[] = [
  {
    title: "fun-things",
    year: "2024",
    blurb:
      "My open-source Python utility library on PyPI — 30+ modules covering async helpers, retry/middleware patterns, lazy loading, type and network utilities, custom JSON encoding and structured logging.",
    tags: ["Python", "PyPI"],
    repoTags: ["MIT", "Poetry"],
    link: "https://github.com/Llyme/fun-things",
    category: "packages",
    simple: true,
  },
  {
    title: "carabao",
    year: "2024",
    blurb:
      "Open-source Python framework on PyPI for building pub/sub data pipelines, with an interactive terminal dev UI, live dashboards and pluggable database hubs for MongoDB, Redis, Elasticsearch and Postgres.",
    tags: ["Python", "PyPI"],
    repoTags: ["Framework", "Textual"],
    image:
      "https://raw.githubusercontent.com/Talisik/carabao/main/previews/logs.jpg",
    link: "https://github.com/Talisik/carabao",
    category: "packages",
  },
  {
    title: "lane2lane",
    year: "2024",
    blurb:
      "Open-source Python library on PyPI for building flexible, chainable and prioritized processing pipelines — the pipeline primitive that higher-level frameworks compose on top of.",
    tags: ["Python", "PyPI"],
    repoTags: ["Library", "Pipelines"],
    link: "https://github.com/Talisik/lane2lane",
    category: "packages",
    simple: true,
  },
  {
    title: "generic-consumer",
    year: "2024",
    blurb:
      "Authored a Python framework on PyPI for consumer-pattern processing — prioritized sync/async execution, payload preprocessing, conditional activation and nested consumer hierarchies.",
    tags: ["Python", "PyPI"],
    repoTags: ["Async", "Pub/Sub"],
    link: "https://github.com/Llyme/generic-consumer",
    category: "packages",
    simple: true,
  },
  {
    title: "lazy-redis-log",
    year: "2024",
    blurb:
      "Authored a small Python package on PyPI — like print(), but also writes log lines to Redis Streams for lightweight, centralized log fan-out.",
    tags: ["Python", "PyPI"],
    repoTags: ["Redis", "Streams"],
    link: "https://github.com/Llyme/lazy-redis-log",
    category: "packages",
    simple: true,
  },
  {
    title: "Unity Helper Libraries",
    year: "2023",
    blurb:
      "Open-source suite of 8 composable C# libraries for the Unity engine — a hybrid 2D character controller, MonoBehaviour singletons, and camera/math/collection/text/type/XML helpers covering common gameplay and tooling needs.",
    tags: ["C#", "Unity"],
    repoTags: ["Open Source", "Game Dev"],
    link: "https://github.com/llyme-unity-library",
    category: "packages",
    simple: true,
  },
  {
    title: "Unity XML Serializer",
    year: "2023",
    blurb:
      "Open-source C# serialization engine that round-trips Unity GameObjects and components to/from XML — reflection-based member resolution, circular references via deferred resolution, custom constructors and pluggable resolvers.",
    tags: ["C#", "Unity"],
    repoTags: ["Serialization", "Reflection"],
    image:
      "https://raw.githubusercontent.com/llyme-unity-library/unity-xml-serializer/main/Sample1.png",
    link: "https://github.com/llyme-unity-library/unity-xml-serializer",
    category: "packages",
  },
]

export const projects: Project[] = [
  ...steamProjects,
  ...itchProjects,
  ...staticProjects,
  ...packageProjects,
]

export const CATEGORIES: { id: Category; label: string }[] = [
  { id: "mods", label: "Steam Mods" },
  { id: "games", label: "Games" },
  { id: "tools", label: "Tools" },
  { id: "packages", label: "Open Source" },
]
