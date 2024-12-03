import type { PlasmoCSConfig } from "plasmo"

import { getProperNounExtractorConfig } from "~lib/config"
import { getVideoDescription, getVideoTitle } from "~lib/getContext"
import { extractProperNouns } from "~lib/properNounExtractor"
import { replaceProperNoun } from "~lib/properNounReplacer"

export const config: PlasmoCSConfig = {
  matches: ["https://www.youtube.com/watch*"],
  all_frames: true
}

console.log("🚀Content script loaded!")
let ongoingUpdate: ReturnType<typeof setTimeout> | null = null // Track ongoing updates

function updateCaptions(properNouns: string[]) {
  const nodes = document.querySelectorAll<HTMLSpanElement>(
    ".ytp-caption-segment"
  )
  for (const node of nodes) {
    for (const noun of properNouns) {
      const res = replaceProperNoun(noun, node.innerText) // Get the result directly
      if (res !== node.innerText) {
        console.log("before", node.innerText)
        console.log("after", res)
        node.innerText = res
      }
    }
  }

  ongoingUpdate = setTimeout(() => updateCaptions(properNouns), 100)
}

// New function to observe URL changes
function observeUrlChanges() {
  let lastUrl = location.href
  const observer = new MutationObserver(() => {
    if (location.href !== lastUrl) {
      console.log("last url, current url", lastUrl, location.href)
      lastUrl = location.href
      if (ongoingUpdate) {
        clearTimeout(ongoingUpdate) // Cancel ongoing updates on page transition
      }
      if (isVideoPage()) {
        window.location.reload() // dirty hack because getting video description is depending on the initial html
      }
    }
  })

  observer.observe(document, { childList: true, subtree: true })
}

// Check if the current page is a video page
function isVideoPage(): boolean {
  return /https:\/\/www\.youtube\.com\/watch\?v=/.test(location.href)
}

async function startFixingCaptions() {
  const title = await getVideoTitle()
  const description = await getVideoDescription()
  if (!title || !description) return
  console.log("starting fixing captions for: ", title)

  const config = await getProperNounExtractorConfig()
  console.log("config", config)
  const properNouns = await extractProperNouns(title, description)
  console.log("extracted proper nouns", properNouns)
  updateCaptions(properNouns)
}

// Start observing URL changes
observeUrlChanges()
if (isVideoPage()) {
  startFixingCaptions() // Initial call to main if it's a video page
}
