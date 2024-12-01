export class DomainDetector {
  private static readonly systemPrompt = `Your task is to identify the main subject of a video title.
Output a SINGLE word that best describes the domain.

Example:
Input: "How to make perfect scrambled eggs"
Output: cooking

Input: "Kontakt Builder KSP Scripting Course"
Output: music-software

Input: "Calculus 1 - Limits and Continuity"
Output: mathematics

Rules:
- Output must be ONE word (use hyphen if needed)
- No explanation
- No punctuation
- Keep it simple and general`

  constructor() {}

  async detect(videoTitle: string): Promise<string | null> {
    const session = await window.ai.languageModel.create({
      systemPrompt: DomainDetector.systemPrompt
    })
    try {
      const response = await session.prompt(videoTitle)
      return response.trim().toLowerCase()
    } catch (e) {
      return null
    }
  }
}
