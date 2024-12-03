import { doubleMetaphone } from "double-metaphone"

function metaphoneDistance(
  [primary1, secondary1]: [string, string],
  [primary2, secondary2]: [string, string]
): number {
  // If primaries match exactly
  if (primary1 === primary2) {
    // If both have secondaries, compare them
    if (secondary1 && secondary2) {
      // If one secondary is a prefix of the other (like F vs FF)
      if (
        secondary2.startsWith(secondary1) ||
        secondary1.startsWith(secondary2)
      ) {
        return 0.1 // Very close match
      }
      // Different secondaries
      return 0.5
    }
    // One or both missing secondary, but primary matches
    return 0.2
  }
  // Primaries don't match
  return 1
}

export function replaceProperNoun(properNoun: string, text: string): string {
  const properNounMetaphones = doubleMetaphone(properNoun.toLowerCase())

  return text.replace(/\b\w+\b/g, (word) => {
    const wordMetaphones = doubleMetaphone(word.toLowerCase())

    const distance = metaphoneDistance(properNounMetaphones, wordMetaphones)

    // Adjust this threshold based on testing
    if (distance <= 0.2) {
      return properNoun
    }

    return word
  })
}
