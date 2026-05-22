#!/usr/bin/env node
// Fetches public repo metadata + languages, writes src/constants/github.json.
import { writeFile, mkdir } from "node:fs/promises"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const REPOS = ["Llyme/Kunoichi"]
const OUT = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "../src/constants/github.json",
)

const headers = { "User-Agent": "portfolio-build", Accept: "application/vnd.github+json" }
if (process.env.GITHUB_TOKEN) {
  headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`
}

async function getJson(url) {
  const res = await fetch(url, { headers })
  if (!res.ok) throw new Error(`${url}: ${res.status}`)
  return res.json()
}

const items = []
for (const slug of REPOS) {
  const repo = await getJson(`https://api.github.com/repos/${slug}`)
  const langs = await getJson(`https://api.github.com/repos/${slug}/languages`)
  items.push({
    slug,
    name: repo.name,
    description: repo.description ?? "",
    url: repo.html_url,
    homepage: repo.homepage ?? "",
    stars: repo.stargazers_count ?? 0,
    forks: repo.forks_count ?? 0,
    watchers: repo.watchers_count ?? 0,
    openIssues: repo.open_issues_count ?? 0,
    license: repo.license?.spdx_id ?? "",
    topics: repo.topics ?? [],
    languages: Object.keys(langs),
    primaryLanguage: repo.language ?? "",
    pushedAt: repo.pushed_at,
    createdAt: repo.created_at,
  })
}

await mkdir(dirname(OUT), { recursive: true })
await writeFile(OUT, JSON.stringify(items, null, 2) + "\n")
console.log(`wrote ${items.length} repos → ${OUT}`)
