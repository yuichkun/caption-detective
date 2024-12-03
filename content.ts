import type { PlasmoCSConfig } from "plasmo"

import { getProperNounExtractorConfig } from "~lib/config"
import { getVideoDescription, getVideoTitle } from "~lib/getContext"
import { extractProperNouns } from "~lib/properNounExtractor"
import { replaceProperNoun } from "~lib/properNounReplacer"

export const config: PlasmoCSConfig = {
  matches: ["https://www.youtube.com/*"],
  all_frames: true
}

console.log("🚀Content script loaded!")
async function main() {
  const description = getVideoDescription()
  if (!description) return

  const config = await getProperNounExtractorConfig()
  console.log("config", config)
  const properNouns = await extractProperNouns(description)
  console.log("extracted proper nouns", properNouns)
  updateCaptions(properNouns)
}
main()

async function updateCaptions(properNouns: string[]) {
  const nodes = document.querySelectorAll<HTMLSpanElement>(
    ".ytp-caption-segment"
  )
  for await (const node of nodes) {
    for await (const noun of properNouns) {
      try {
        const res = await replaceProperNoun(noun, node.innerText)
        if (res !== node.innerText) {
          console.log("before", node.innerText)
          console.log("after", res)
          node.innerText = res
        }
      } catch (e) {
        console.error(e)
      }
    }
  }
  setTimeout(() => updateCaptions(properNouns), 100)
}
