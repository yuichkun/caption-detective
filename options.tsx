import { Settings } from "~components/Settings"

function OptionsIndex() {
  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">
        Proper Noun Extractor Settings
      </h1>
      <Settings />
    </div>
  )
}

export default OptionsIndex
