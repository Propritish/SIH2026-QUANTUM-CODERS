// One-time / repeatable seed script: loads the monument catalogue into
// MongoDB Atlas, creates the 2dsphere index the geofence check needs, and
// (if ADMIN_EMAIL / ADMIN_PASSWORD are set) seeds one admin account.
//
// Usage:
//   npm run seed
// (reads .env.local automatically)

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import User from "../api/models/User.js";
import Monument from "../api/models/Monument.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "..", ".env.local") });

const MONUMENTS = [
  {
    slug: "konark",
    title: "Konark Sun Temple",
    era: "1250 CE",
    unesco: 1984,
    blurb: "A stone chariot for the sun god, carried on 24 carved wheels.",
    descriptions: {
      restored:
        "The 1250 CE reconstruction: a full spire and twelve pairs of wheels, each one accurate to within four minutes as a sundial.",
      damaged:
        "The present-day ruin: the spire is gone and the sanctum was backfilled with sand in 1903 to stop the walls from collapsing.",
    },
    narration: {
      restored:
        "In 1250 of the common era, King Narasimhadeva the First raised this temple as a chariot for Surya, the sun god. Twelve pairs of wheels lined its base, each one a working sundial. Seven stone horses stood ready to pull it across the sky.",
      damaged:
        "Centuries of salt wind from the Bay of Bengal wore the sandstone thin. The main spire collapsed long ago, and colonial-era engineers filled the sanctum with sand to keep the remaining walls standing.",
    },
    location: { type: "Point", coordinates: [86.0945, 19.8876] }, // [lng, lat]
    radiusMeters: 800,
    models: {
      damagedUrl: "",
      restoredUrl: "",
    },
    audioGuides: { en: "", or: "", hi: "" },
    hotspots: [
      {
        id: "wheel-hub",
        label: "Sundial wheel",
        description: "One of 24 wheels; the spokes' shadow once told the time to within four minutes.",
        position: "0 0.4 0.3",
        normal: "0 1 0",
      },
      {
        id: "spire-base",
        label: "Spire base",
        description: "The vimana spire above this point collapsed sometime before the 19th century.",
        position: "0 2.1 -0.2",
        normal: "0 1 0",
      },
      {
        id: "horse",
        label: "Stone horse",
        description: "One of seven horses carved to appear as though pulling the temple-chariot.",
        position: "-1.2 0.3 0.6",
        normal: "-1 0 0",
      },
    ],
    live: true,
  },
  {
    slug: "lingaraj",
    title: "Lingaraj Temple",
    era: "11th century",
    blurb: "Bhubaneswar's tallest deul, still an active place of worship.",
    location: { type: "Point", coordinates: [85.8341, 20.2381] },
    live: false,
  },
  {
    slug: "udayagiri",
    title: "Udayagiri Caves",
    era: "2nd century BCE",
    blurb: "Rock-cut chambers carved for Jain ascetics.",
    location: { type: "Point", coordinates: [85.7822, 20.2894] },
    live: false,
  },
  {
    slug: "barabati",
    title: "Barabati Fort",
    era: "14th century",
    blurb: "A moated Gajapati fort on the banks of the Mahanadi.",
    location: { type: "Point", coordinates: [85.8825, 20.4867] },
    live: false,
  },
  {
    slug: "chilika",
    title: "Chilika Heritage Trail",
    era: "Living heritage",
    blurb: "Fishing villages around Asia's largest brackish lagoon.",
    location: { type: "Point", coordinates: [85.32, 19.7] },
    radiusMeters: 1200,
    live: false,
  },
  {
    slug: "jagannath",
    title: "Jagannath Temple",
    era: "12th century",
    blurb: "Home of the annual Rath Yatra chariot procession.",
    location: { type: "Point", coordinates: [85.8188, 19.8048] },
    live: false,
  },
];

async function seed() {
  if (!process.env.MONGODB_URI) {
    console.error("MONGODB_URI is not set. Add it to .env.local first.");
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGODB_URI, {
    dbName: process.env.MONGODB_DB || "odisha_ar_heritage",
  });

  for (const m of MONUMENTS) {
    await Monument.findOneAndUpdate({ slug: m.slug }, { $set: m }, { upsert: true });
  }
  await Monument.syncIndexes(); // ensures the 2dsphere index on `location` exists
  console.log(`Seeded ${MONUMENTS.length} monument(s) and confirmed the 2dsphere index.`);

  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (adminEmail && adminPassword) {
    const passwordHash = await bcrypt.hash(adminPassword, 10);
    await User.findOneAndUpdate(
      { email: adminEmail.toLowerCase() },
      { $set: { email: adminEmail.toLowerCase(), passwordHash, role: "admin", name: "Curator" } },
      { upsert: true }
    );
    console.log(`Seeded admin account: ${adminEmail}`);
  } else {
    console.log("ADMIN_EMAIL / ADMIN_PASSWORD not set in .env.local — skipped admin account seeding.");
  }

  await mongoose.connection.close();
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
