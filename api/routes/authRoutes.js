import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { timingSafeEqual } from "node:crypto";
import User from "../models/User.js";

const router = Router();

function signToken(user) {
  return jwt.sign(
    { userId: user._id.toString(), role: user.role, email: user.email, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}

// Tourist self-signup always assigns the tourist role.
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body || {};
    if (!name || !email || !password) {
      return res.status(400).json({ error: "name, email and password are required" });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters" });
    }

    const normalizedEmail = String(email).toLowerCase().trim();
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      return res.status(409).json({ error: "An account with this email already exists" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email: normalizedEmail, passwordHash, role: "tourist" });

    const token = signToken(user);
    return res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error("POST /api/auth/register error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Admin self-signup is available only to people who have the private setup key.
router.post("/admin-register", async (req, res) => {
  try {
    const { name, email, password, setupKey } = req.body || {};
    const expectedKey = process.env.ADMIN_SIGNUP_KEY;
    if (!expectedKey || expectedKey.length < 32) {
      return res.status(503).json({ error: "Admin signup is not configured on this server" });
    }
    const suppliedKeyBuffer = typeof setupKey === "string" ? Buffer.from(setupKey) : Buffer.alloc(0);
    const expectedKeyBuffer = Buffer.from(expectedKey);
    const keyMatches = typeof setupKey === "string" &&
      suppliedKeyBuffer.length === expectedKeyBuffer.length &&
      timingSafeEqual(suppliedKeyBuffer, expectedKeyBuffer);
    if (!keyMatches) {
      return res.status(403).json({ error: "Invalid admin signup key" });
    }
    if (!name || !email || !password) {
      return res.status(400).json({ error: "name, email and password are required" });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters" });
    }

    const normalizedEmail = String(email).toLowerCase().trim();
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      return res.status(409).json({ error: "An account with this email already exists" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email: normalizedEmail, passwordHash, role: "admin" });
    const token = signToken(user);
    return res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error("POST /api/auth/admin-register error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/auth/login — shared by tourists and admins. The frontend
// passes expectedRole so, e.g., an admin account can't be used to log in
// through the tourist form and vice versa.
router.post("/login", async (req, res) => {
  try {
    const { email, password, expectedRole } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ error: "email and password are required" });
    }

    const user = await User.findOne({ email: String(email).toLowerCase().trim() });
    if (!user) return res.status(401).json({ error: "Invalid email or password" });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: "Invalid email or password" });

    if (expectedRole && user.role !== expectedRole) {
      return res.status(403).json({ error: `This account is a "${user.role}" account, not "${expectedRole}"` });
    }

    const token = signToken(user);
    return res.status(200).json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error("POST /api/auth/login error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
