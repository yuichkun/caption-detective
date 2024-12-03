import { Settings } from "~components/Settings"

function IndexPopup() {
  return (
    <div className="p-4" style={{ minWidth: "400px" }}>
      <h2 className="text-lg font-semibold mb-3">Settings</h2>
      <Settings />
    </div>
  )
}

export default IndexPopup
