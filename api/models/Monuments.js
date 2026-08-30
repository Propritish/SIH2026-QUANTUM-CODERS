import mongoose from "mongoose";

const hotspotSchema = new mongoose.Schema(
  {
    id: String,
    label: String,
    description: String,
    position: String, // "x y z" metres, model-local space
    normal: String,
  },
  { _id: false }
);

const geoPointSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ["Point"], default: "Point" },
    coordinates: { type: [Number], required: true }, // [lng, lat] — GeoJSON order
  },
  { _id: false }
);

// Monument GeoJSON schema & 3D asset links.
const monumentSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true }, // e.g. "konark"
    title: { type: String, required: true },
    era: String,
    unesco: Number,
    blurb: String,
    descriptions: {
      restored: String,
      damaged: String,
    },
    narration: {
      restored: String,
      damaged: String,
    },
    location: { type: geoPointSchema, required: true },
    radiusMeters: { type: Number, default: 800 },
    models: {
      damagedUrl: String,
      restoredUrl: String,
      usdzUrl: String,
    },
    audioGuides: {
      en: String,
      or: String,
      hi: String,
    },
    hotspots: [hotspotSchema],
    live: { type: Boolean, default: false },
  },
  { timestamps: true }
);

monumentSchema.index({ location: "2dsphere" });

export default mongoose.models.Monument || mongoose.model("Monument", monumentSchema);
