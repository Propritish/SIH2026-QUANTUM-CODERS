import React from "react";
import { FileBox } from "lucide-react";

// Small file picker for a .glb model, used inside AdminPortal purely for
// local preview — actual hosting URL is entered separately (see the
// "Hosted .glb URL" field in AdminPortal.jsx) since there's no file
// storage backend wired in yet (S3 / Cloudflare R2 / GridFS would go here).
export default function ModelUploader({ fileName, onSelect }) {
  return (
    <label className="model-uploader">
      <FileBox size={15} />
      {fileName || "Choose .glb file (local preview only)"}
      <input
        type="file"
        accept=".glb,.gltf"
        className="model-uploader-input"
        onChange={(e) => onSelect(e.target.files[0]?.name || "")}
      />
    </label>
  );
}
