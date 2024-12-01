import { DomainDetector } from "./domainDetector"

const systemPrompt = `Extract proper nouns from the text.
Output only proper nouns separated by commas.

Example:
Input: "Learn Python programming with Django and Visual Studio Code"
Output: Python, Django, Visual Studio Code

Input: "How to cook Italian pasta like Gordon Ramsay in New York"
Output: Italian, Gordon Ramsay, New York

Input: "Tips for improving your writing skills"
Output:

Input: "Using microsoft excel and google sheets for data analysis"
Output: Microsoft Excel, Google Sheets`

export async function extractProperNouns(
  description: string
): Promise<string[]> {
  if (!description) return []

  const splitDescription = description.split("\n")
  const properNouns: string[] = []
  let processedLines = 0
  const totalLines = splitDescription.length

  const session = await window.ai.languageModel.create({
    systemPrompt
  })

  for await (const line of splitDescription) {
    try {
      const response = await session.prompt(`Input: "${line}"`)
      const lineProperNouns = response
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item.length > 0)
      properNouns.push(...lineProperNouns)

      processedLines++
      const percentage = Math.round((processedLines / totalLines) * 100)
      console.clear()
      console.log(`Proper nouns extraction progress: ${percentage}%`)
    } catch (e) {
      continue
    }
  }

  const uniqueProperNouns = [...new Set(properNouns)]
  console.log("uniqueProperNouns", uniqueProperNouns)
  let verifiedProperNouns: string[] = []
  try {
    verifiedProperNouns = await verifyProperNoun(uniqueProperNouns.join(", "))
    console.log("verifiedProperNouns", verifiedProperNouns)
  } catch (e) {
    console.warn("Failed to verify proper nouns")
    return uniqueProperNouns
  }

  let suspiciousNounList: string[] = []
  try {
    suspiciousNounList = await checkSuspiciousNoun(
      verifiedProperNouns.join(", ")
    )
    console.log("suspiciousNounList", suspiciousNounList)
  } catch (e) {
    console.warn("Failed to check suspicious nouns")
    return verifiedProperNouns
  }

  const domain = await new DomainDetector().detect(description)
  console.log("domain", domain)
  if (!domain) return suspiciousNounList
  let relatedProperNounList: string[] = []
  try {
    relatedProperNounList = (
      await Promise.all(
        suspiciousNounList.map((noun) => brainStormRelatedNoun(noun, domain))
      )
    ).flat()
    console.log("relatedProperNounList", relatedProperNounList)
  } catch (e) {
    console.warn("Failed to brain storm related nouns")
    return suspiciousNounList
  }
  const properNounList = [...suspiciousNounList, ...relatedProperNounList]
    .map((noun) => noun.replaceAll(/['""`]/g, ""))
    .map((noun) => noun.trim())
  const uniqueProperNounList = [...new Set(properNounList)]
  return uniqueProperNounList
}

const verifyProperNounPrompt = `Your task is to filter out the non-proper nouns from the input list.
Output only the proper nouns separated by commas.

Example:
Input: "cat, https://www.youtube.com, 12345, Microsoft Excel"
Output: "Microsoft Excel"`
async function verifyProperNoun(nounList: string) {
  const session = await window.ai.languageModel.create({
    systemPrompt: verifyProperNounPrompt
  })
  const response = await session.prompt(`Input: "${nounList}"`)
  const verifiedNounList = response
    .split(",")
    .map((item) => item.trim())
    .filter((item) => item.length > 0)
  return [...new Set(verifiedNounList)]
}

const checkSuspiciousNounPrompt = `Your task is to pick out the nouns that may not be transcribed correctly from the input list.
Output only the nouns that may not be transcribed correctly separated by commas.

Example:
Input: "Vue, Apple, London, Michael Jackson"
Output: "Vue"`
async function checkSuspiciousNoun(nounList: string) {
  const session = await window.ai.languageModel.create({
    systemPrompt: checkSuspiciousNounPrompt
  })
  const response = await session.prompt(`Input: "${nounList}"`)
  const suspiciousNounList = response
    .split(",")
    .map((item) => item.trim())
    .filter((item) => item.length > 0)
  return [...new Set(suspiciousNounList)]
}

const brainStormRelatedNounPrompt = `Your task is to generate related proper nouns in the same input domain as the input noun.

Output only the related proper nouns separated by commas.

Example:
Input domain: "art"
Input proper noun: "Basquiat"
Output: "Picasso, Andy Warhol"

Input domain: "technology"
Input proper noun: "Apple"
Output: "iPhone, MacBook, iMac"`
async function brainStormRelatedNoun(noun: string, domain: string) {
  const session = await window.ai.languageModel.create({
    systemPrompt: brainStormRelatedNounPrompt
  })
  try {
    const response = await session.prompt(
      `Input domain: "${domain}"\nInput proper noun: "${noun}"`
    )
    const relatedNounList = response
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item.length > 0)
    return [...new Set(relatedNounList)]
  } catch (e) {
    console.error(e)
    return []
  }
}
