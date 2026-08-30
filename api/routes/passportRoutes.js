import { Router } from "express";
import User from "../models/User.js";
import Monument from "../models/Monument.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = Router();

// Every route below requires a logged-in tourist (or admin) account.
router.use(requireAuth);

// GET /api/passport/history — this account's visited monuments + badges
router.get("/history", async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).populate("visitedMonuments.monumentId", "title slug");
    if (!user) return res.status(404).json({ error: "User not found" });
    return res.status(200).json({
      visitedMonuments: user.visitedMonuments,
      passportBadges: user.passportBadges,
    });
  } catch (err) {
    console.error("GET /api/passport/history error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/passport/unlock-stamp — called after a successful, server-
// verified-by-distance geofence check.
router.post("/unlock-stamp", async (req, res) => {
  try {
    const { monumentId, distanceMeters } = req.body || {};
    if (!monumentId) return res.status(400).json({ error: "monumentId is required" });

    const monument = await Monument.findOne({ slug: monumentId });
    if (!monument) return res.status(404).json({ error: "Unknown monument" });

    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const alreadyVisited = user.visitedMonuments.some((v) => v.monumentId.equals(monument._id));
    if (!alreadyVisited) {
      user.visitedMonuments.push({ monumentId: monument._id, distanceMeters });
    }
    if (!user.passportBadges.includes(monumentId)) {
      user.passportBadges.push(monumentId);
    }
    await user.save();

    return res.status(200).json({ passportBadges: user.passportBadges, visitedMonuments: user.visitedMonuments });
  } catch (err) {
    console.error("POST /api/passport/unlock-stamp error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/passport/stats — quick counts for the Passport page header
router.get("/stats", async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ error: "User not found" });
    const totalMonuments = await Monument.countDocuments();
    return res.status(200).json({ unlockedCount: user.passportBadges.length, totalMonuments });
  } catch (err) {
    console.error("GET /api/passport/stats error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
