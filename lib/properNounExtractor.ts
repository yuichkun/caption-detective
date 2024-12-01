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

  return properNouns
}
