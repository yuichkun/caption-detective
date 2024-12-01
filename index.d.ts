export {}

interface AISession {
  prompt: (input: string) => Promise<string>
}

interface LanguageModel {
  create: (options: { systemPrompt: string }) => Promise<AISession>
}

interface AI {
  languageModel: LanguageModel
}

declare global {
  interface Window {
    ai: AI
  }
}
