import React from "react";
import { FileBox } from "lucide-react";
import { useLanguage } from "../../i18n/LanguageContext.jsx";

// Small file picker for a .glb model, used inside AdminPortal purely for
// local preview — actual hosting URL is entered separately (see the
// "Hosted .glb URL" field in AdminPortal.jsx) since there's no file
// storage backend wired in yet (S3 / Cloudflare R2 / GridFS would go here).
export default function ModelUploader({ fileName, onSelect }) {
  const { t } = useLanguage();
  return (
    <label className="model-uploader">
      <FileBox size={15} />
      {fileName || t("portal.file")}
      <input
        type="file"
        accept=".glb,.gltf"
        className="model-uploader-input"
        onChange={(e) => onSelect(e.target.files[0]?.name || "")}
      />
    </label>
  );
}
