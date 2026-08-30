# Narration audio assets

Place multilingual narration clips here, named `<monumentId>_<langCode>.mp3`:

- `konark_en.mp3` — English narration
- `konark_or.mp3` — Odia narration
- `konark_hi.mp3` — Hindi narration (add as recorded)

`src/components/AudioGuide/AudioGuide.jsx` looks up files by this
naming convention, keyed off `src/data/monuments.json`.
