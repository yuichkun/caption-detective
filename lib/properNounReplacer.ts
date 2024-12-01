import { doubleMetaphone } from "double-metaphone"

export function replaceProperNoun(properNoun: string, text: string): string {
  // Get double metaphone encoding for the proper noun
  const [properNounPrimary, properNounSecondary] = doubleMetaphone(
    properNoun.toLowerCase()
  )

  // Use regex to find word boundaries
  return text.replace(/\b\w+\b/g, (word) => {
    const [wordPrimary, wordSecondary] = doubleMetaphone(word.toLowerCase())

    // Compare phonetic encodings
    if (
      wordPrimary === properNounPrimary ||
      (properNounSecondary && wordSecondary === properNounSecondary)
    ) {
      return properNoun // Replace with the correct proper noun
    }

    return word // Keep original word
  })
}
