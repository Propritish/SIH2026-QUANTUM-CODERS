# 3D model assets

Place the temple models here:

- `konark_damaged.glb` — present-day scan/model, weathered, spire missing
- `konark_restored.glb` — 1250 CE reconstruction, full spire and wheel set

Keep each file under ~15 MB (Blender: apply Draco compression on export,
low-poly LODs for mobile GPUs) so `<model-viewer>` loads quickly over
mobile data at the temple site.

These binaries aren't included in this scaffold — swap them in and the
app (see `src/components/ArViewer/ArViewer.jsx`) will pick them up as-is.
