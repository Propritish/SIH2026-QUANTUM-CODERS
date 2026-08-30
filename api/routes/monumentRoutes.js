import { Router } from "express";
import mongoose from "mongoose";
import Monument from "../models/Monument.js";
import { requireAuth, requireRole } from "../middleware/authMiddleware.js";

const router = Router();

// GET /api/monuments — list all. Public: browsing the catalogue doesn't
// require login, though the Explorer/Passport pages still gate the actual
// AR experience behind tourist auth.
router.get("/", async (req, res) => {
  try {
    const monuments = await Monument.find().sort({ title: 1 });
    return res.status(200).json(monuments);
  } catch (err) {
    console.error("GET /api/monuments error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/monuments/:id — lookup by slug (e.g. "konark") or Mongo _id
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const isObjectId = mongoose.isValidObjectId(id);
    const monument = await Monument.findOne(isObjectId ? { $or: [{ slug: id }, { _id: id }] } : { slug: id });
    if (!monument) return res.status(404).json({ error: "Monument not found" });
    return res.status(200).json(monument);
  } catch (err) {
    console.error("GET /api/monuments/:id error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/monuments/:id/geofence-check?lat=..&lng=..
// Server-verified proximity check via MongoDB's $geoNear, using the
// monument's 2dsphere index (see models/Monument.js).
router.get("/:id/geofence-check", async (req, res) => {
  try {
    const { id } = req.params;
    const { lat, lng } = req.query;
    const latitude = Number(lat);
    const longitude = Number(lng);
    if (Number.isNaN(latitude) || Number.isNaN(longitude)) {
      return res.status(400).json({ error: "lat and lng query params are required numbers" });
    }

    const monument = await Monument.findOne({ slug: id });
    if (!monument) return res.status(404).json({ error: "Monument not found" });

    const [result] = await Monument.aggregate([
      {
        $geoNear: {
          near: { type: "Point", coordinates: [longitude, latitude] },
          distanceField: "distanceMeters",
          spherical: true,
          query: { slug: id },
        },
      },
    ]);

    const distanceMeters = result ? result.distanceMeters : null;
    const withinRange = distanceMeters !== null && distanceMeters <= monument.radiusMeters;

    return res.status(200).json({ slug: id, distanceMeters, radiusMeters: monument.radiusMeters, withinRange });
  } catch (err) {
    console.error("GET /api/monuments/:id/geofence-check error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/monuments — admin-only, adds/updates a monument record.
// Used by src/components/AdminPortal/AdminPortal.jsx.
router.post("/", requireAuth, requireRole("admin"), async (req, res) => {
  try {
    const { title, era, lat, lng, radiusMeters, modelUrl } = req.body || {};
    if (!title || lat === undefined || lng === undefined) {
      return res.status(400).json({ error: "title, lat and lng are required" });
    }

    const latitude = Number(lat);
    const longitude = Number(lng);
    if (Number.isNaN(latitude) || Number.isNaN(longitude)) {
      return res.status(400).json({ error: "lat and lng must be numbers" });
    }

    const slug = String(title).toLowerCase().trim().replace(/\s+/g, "-");

    const monument = await Monument.findOneAndUpdate(
      { slug },
      {
        $set: {
          slug,
          title,
          era: era || null,
          location: { type: "Point", coordinates: [longitude, latitude] },
          ...(radiusMeters ? { radiusMeters: Number(radiusMeters) } : {}),
          ...(modelUrl ? { "models.restoredUrl": modelUrl } : {}),
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return res.status(201).json(monument);
  } catch (err) {
    console.error("POST /api/monuments error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
