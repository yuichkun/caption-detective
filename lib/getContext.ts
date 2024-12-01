export function getVideoTitle() {
  const titleElement = document.querySelector('#title > h1 > yt-formatted-string') as HTMLHeadingElement
  return titleElement?.innerText ?? null

}

// Dirty hack to get the video description
export function getVideoDescription() {
  const allScripts = document.querySelectorAll('script')
  const targetScript = Array.from(allScripts).find((script) => script.innerText.includes('ytInitialPlayerResponse'))
  const rawScriptContent = targetScript?.innerText
  if (!rawScriptContent) return null
  
  // Extract the JSON object using regex
  const match = rawScriptContent.match(/var ytInitialPlayerResponse = ({.*?});/)
  if (!match?.[1]) return null
  const json = JSON.parse(match[1])
  try {
    return json.microformat.playerMicroformatRenderer.description.simpleText
  } catch (e) {
    return null
  }
}
