import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import monumentRoutes from "./routes/monumentRoutes.js";
import passportRoutes from "./routes/passportRoutes.js";

dotenv.config({ path: ".env.local" });
dotenv.config(); // fallback to .env if .env.local isn't present (e.g. on Vercel, where env vars are injected directly)

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => res.json({ ok: true }));

// Ensure a DB connection exists before handling any other request. Reuses
// a cached connection across warm serverless invocations (see config/db.js).
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error("MongoDB connection error:", err);
    res.status(500).json({ error: "Database connection failed" });
  }
});

app.use("/api/auth", authRoutes);
app.use("/api/monuments", monumentRoutes);
app.use("/api/passport", passportRoutes);

// Running directly (`node api/index.js`, i.e. `npm run server` for local
// full-stack dev) starts a normal HTTP server. On Vercel this file is
// instead imported as a serverless function via vercel.json's rewrite,
// and `app.listen` never runs — `process.env.VERCEL` is set there.
if (!process.env.VERCEL) {
  const port = process.env.PORT || 5000;
  app.listen(port, () => console.log(`API server listening on http://localhost:${port}`));
}

export default app;
