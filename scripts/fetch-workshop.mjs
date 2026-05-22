#!/usr/bin/env node
// Scrapes Steam workshop items for a profile, writes src/constants/workshop.json.
import { writeFile, mkdir } from "node:fs/promises"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const STEAM_ID = "76561198068121667"
const OUT = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "../src/constants/workshop.json",
)

const APP_NAMES = {
  294100: "RimWorld",
  211820: "Starbound",
}

function stripBBCode(s) {
  return s
    .replace(/\[[^\]]+\]/g, "")
    .replace(/\r\n/g, "\n")
    .trim()
}

async function fetchIds() {
  const ids = new Set()
  for (let page = 1; page <= 10; page++) {
    const res = await fetch(
      `https://steamcommunity.com/profiles/${STEAM_ID}/myworkshopfiles/?p=${page}`,
    )
    if (!res.ok) throw new Error(`profile page ${page}: ${res.status}`)
    const html = await res.text()
    const matches = [...html.matchAll(/filedetails\/\?id=(\d+)/g)]
    if (matches.length === 0) break
    const before = ids.size
    matches.forEach((m) => ids.add(m[1]))
    if (ids.size === before) break
  }
  return [...ids]
}

async function fetchDetails(ids) {
  const body = new URLSearchParams()
  body.set("itemcount", String(ids.length))
  ids.forEach((id, i) => body.set(`publishedfileids[${i}]`, id))
  const res = await fetch(
    "https://api.steampowered.com/ISteamRemoteStorage/GetPublishedFileDetails/v1/",
    { method: "POST", body },
  )
  if (!res.ok) throw new Error(`details: ${res.status}`)
  const json = await res.json()
  return json.response.publishedfiledetails
}

const ids = await fetchIds()
console.log(`found ${ids.length} workshop items`)
const details = await fetchDetails(ids)

const items = details
  .filter((d) => d.result === 1)
  .map((d) => ({
    id: d.publishedfileid,
    title: d.title,
    description: stripBBCode(d.description ?? ""),
    preview: d.preview_url,
    app: APP_NAMES[d.consumer_app_id] ?? String(d.consumer_app_id),
    appId: d.consumer_app_id,
    subscriptions: d.lifetime_subscriptions ?? 0,
    favorites: d.lifetime_favorited ?? 0,
    views: d.views ?? 0,
    votesUp: d.vote_data?.votes_up ?? 0,
    votesDown: d.vote_data?.votes_down ?? 0,
    voteScore: d.vote_data?.score ?? 0,
    tags: Array.isArray(d.tags) ? d.tags.map((t) => t.tag).filter(Boolean) : [],
    fileSize: Number(d.file_size ?? 0),
    created: d.time_created,
    updated: d.time_updated,
    url: `https://steamcommunity.com/sharedfiles/filedetails/?id=${d.publishedfileid}`,
  }))
  .sort((a, b) => b.subscriptions - a.subscriptions)

await mkdir(dirname(OUT), { recursive: true })
await writeFile(OUT, JSON.stringify(items, null, 2) + "\n")
console.log(`wrote ${items.length} items → ${OUT}`)
