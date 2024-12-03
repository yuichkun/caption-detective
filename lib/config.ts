import { Storage } from "@plasmohq/storage"

export interface ProperNounExtractorConfig {
  verifyProperNouns: boolean
  checkSuspiciousNouns: boolean
  brainstormRelatedWords: boolean
}

export const DEFAULT_CONFIG: ProperNounExtractorConfig = {
  verifyProperNouns: true,
  checkSuspiciousNouns: true,
  brainstormRelatedWords: true
}

const storage = new Storage()

export async function getProperNounExtractorConfig(): Promise<ProperNounExtractorConfig> {
  try {
    const config = await storage.get("properNounExtractorConfig")
    return {
      ...DEFAULT_CONFIG,
      ...(config && typeof config === "object" ? config : {})
    }
  } catch (error) {
    console.error("Failed to load config:", error)
    return DEFAULT_CONFIG
  }
}

export async function saveProperNounExtractorConfig(
  config: Partial<ProperNounExtractorConfig>
): Promise<void> {
  try {
    await storage.set("properNounExtractorConfig", {
      ...DEFAULT_CONFIG,
      ...config
    })
  } catch (error) {
    console.error("Failed to save config:", error)
  }
}
