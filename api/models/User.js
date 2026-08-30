import mongoose from "mongoose";

const visitedMonumentSchema = new mongoose.Schema(
  {
    monumentId: { type: mongoose.Schema.Types.ObjectId, ref: "Monument", required: true },
    visitedAt: { type: Date, default: Date.now },
    distanceMeters: Number,
  },
  { _id: false }
);

// Tourist user schema & travel history.
// role "admin" accounts are seeded via scripts/seed.js, never created
// through the public /api/auth/register endpoint.
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["tourist", "admin"], default: "tourist" },
    visitedMonuments: [visitedMonumentSchema],
    passportBadges: [{ type: String }], // monument slugs that have been stamped
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", userSchema);
