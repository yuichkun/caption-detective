export class ProperNounExtractor {
  private static readonly systemPrompt = `Extract proper nouns from the text.
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

  constructor() {}

  async extract(description: string): Promise<string[]> {
    const session = await window.ai.languageModel.create({
      systemPrompt: ProperNounExtractor.systemPrompt
    })
    try {
      const response = await session.prompt(`Input: "${description}"`)
      return response
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item.length > 0)
    } catch (e) {
      return []
    }
  }
}
