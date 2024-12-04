import { describe, expect, it } from "vitest"

import { replaceProperNoun } from "./properNounReplacer"

describe("replaceProperNoun", () => {
  it('should replace "view" with "Vue" in the text', () => {
    const properNoun = "Vue"
    const text = "I love view and programming."
    const result = replaceProperNoun(properNoun, text)

    expect(result).toBe("I love Vue and programming.")
  })
  it('should replace "contact" with "Kontakt" in the text', () => {
    const properNoun = "Kontakt"
    const text = "Today, we are going to learn about contact."
    const result = replaceProperNoun(properNoun, text)

    expect(result).toBe("Today, we are going to learn about Kontakt.")
  })
})
