import { useStorage } from "@plasmohq/storage/hook"

import type { ProperNounExtractorConfig } from "~lib/config"
import { DEFAULT_CONFIG } from "~lib/config"

export function Settings() {
  const [config, setConfig] = useStorage<ProperNounExtractorConfig>(
    "properNounExtractorConfig",
    DEFAULT_CONFIG
  )

  const handleConfigChange = (key: keyof ProperNounExtractorConfig) => {
    setConfig({
      ...config,
      [key]: !config[key]
    })
  }

  return (
    <div className="space-y-4">
      <label className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={config.verifyProperNouns}
          onChange={() => handleConfigChange("verifyProperNouns")}
          className="form-checkbox"
        />
        <span>Verify proper nouns</span>
      </label>

      <label className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={config.checkSuspiciousNouns}
          onChange={() => handleConfigChange("checkSuspiciousNouns")}
          className="form-checkbox"
        />
        <span>Check suspicious nouns</span>
      </label>

      <label className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={config.brainstormRelatedWords}
          onChange={() => handleConfigChange("brainstormRelatedWords")}
          className="form-checkbox"
        />
        <span>Brainstorm related words</span>
      </label>

      <div className="mt-4 text-sm text-gray-600">
        <p>
          These settings control how the proper noun extraction process works:
        </p>
        <ul className="list-disc ml-5 mt-2 space-y-1">
          <li>
            <strong>Verify proper nouns:</strong> Double-check if extracted
            words are actually proper nouns
          </li>
          <li>
            <strong>Check suspicious nouns:</strong> Identify potentially
            misspelled or unusual proper nouns
          </li>
          <li>
            <strong>Brainstorm related words:</strong> Generate additional
            related proper nouns based on context
          </li>
        </ul>
      </div>
    </div>
  )
}
