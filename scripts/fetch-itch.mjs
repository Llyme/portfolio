#!/usr/bin/env node
// Scrapes an itch.io user profile, writes src/constants/itch.json.
import { writeFile, mkdir } from "node:fs/promises"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const USER = "misternyan"
const PROFILE_URL = `https://${USER}.itch.io`
const OUT = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "../src/constants/itch.json",
)

function decodeEntities(s) {
  return s
    .replace(/&#0?39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
}

function match1(s, re) {
  const m = s.match(re)
  return m ? decodeEntities(m[1]).trim() : ""
}

function matchAll1(s, re) {
  return [...s.matchAll(re)].map((m) => decodeEntities(m[1]).trim())
}

async function fetchProfile() {
  const res = await fetch(PROFILE_URL)
  if (!res.ok) throw new Error(`profile: ${res.status}`)
  return res.text()
}

function parseCells(html) {
  // Cell openers: <div ... data-game_id="N" ... class="game_cell ...">
  // Attribute order/extra attrs (e.g. dir="auto") vary, so don't assume any.
  const starts = [
    ...html.matchAll(/<div[^>]*data-game_id="(\d+)"[^>]*class="game_cell[^"]*"/g),
  ]
  return starts.map((m, i) => {
    const id = m[1]
    const block = html.slice(
      m.index,
      i + 1 < starts.length ? starts[i + 1].index : html.length,
    )
    // href may appear before or after class — grab the first itch.io game link.
    const url = match1(block, /href="(https?:\/\/[^"/]+\.itch\.io\/[^"]+)"/)
    const image =
      match1(block, /data-gif="([^"]+)"/) ||
      match1(block, /data-lazy_src="([^"]+)"/)
    const title = match1(
      block,
      /<a[^>]*class="title game_link"[^>]*>([\s\S]*?)<\/a>/,
    )
    const description = match1(block, /class="game_text"[^>]*>([\s\S]*?)</)
    const genre = match1(block, /class="game_genre"[^>]*>([\s\S]*?)</)
    const platforms = matchAll1(block, /title="Download for ([^"]+)"/g)
    return {
      id,
      title,
      description,
      url,
      image,
      genre,
      platforms,
    }
  })
}

const html = await fetchProfile()
const items = parseCells(html)

// Guard: a failed/blocked scrape returns 0 cells. Don't clobber existing
// good data with an empty array — keep the committed file instead.
if (items.length === 0) {
  console.warn(`itch: scraped 0 items — keeping existing ${OUT}`)
  process.exit(0)
}

await mkdir(dirname(OUT), { recursive: true })
await writeFile(OUT, JSON.stringify(items, null, 2) + "\n")
console.log(`wrote ${items.length} items → ${OUT}`)
