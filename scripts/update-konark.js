// Direct MongoDB update for Konark monument with complete history
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import Monument from "../api/models/Monument.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "..", ".env.local") });

async function updateKonark() {
  if (!process.env.MONGODB_URI) {
    console.error("MONGODB_URI is not set. Add it to .env.local first.");
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGODB_URI, {
    dbName: process.env.MONGODB_DB || "odisha_ar_heritage",
  });

  const konarkUpdate = {
    slug: "konark",
    title: "Konark Sun Temple",
    era: "1250 CE",
    unesco: 1984,
    blurb: "A stone chariot for the sun god, carried on 24 carved wheels.",
    descriptions: {
      restored:
        "Built around 1250 CE by King Narasimhadeva I of the Eastern Ganga dynasty, the Konark Sun Temple was dedicated to Surya, the Hindu sun god, and designed as a colossal stone chariot with twelve pairs of carved wheels drawn by seven horses, representing the sun's journey across the sky. The temple is considered the finest example of Kalinga architecture, built from laterite, khondalite, and chlorite stone, with iron beams reinforcing key sections. At its height, it featured a magnificent spire (vimana) and intricate carvings that showcased the pinnacle of medieval Indian craftsmanship.",
      damaged:
        "The Konark Sun Temple stands on the Bay of Bengal coast in Odisha, about 35 kilometres northeast of Puri. Over centuries, the temple suffered extensive damage from salt winds and weathering. Its main tower eventually collapsed, and much of the structure fell into ruins. In 1904, the British filled the assembly hall with sand to prevent it from collapsing completely. Despite this deterioration, the surviving carvings and structure have been preserved as a UNESCO World Heritage Site since 1984. European sailors once called it the 'Black Pagoda' for its dark, imposing silhouette, using it as a navigation landmark along the coast. It remains a place of active worship during the annual Chandrabhaga Festival.",
    },
    narration: {
      restored:
        "In 1250 of the common era, King Narasimhadeva the First raised this temple as a chariot for Surya, the sun god. Twelve pairs of wheels lined its base, each one a working sundial, accurate to within four minutes. Seven stone horses stood carved to appear as though pulling the temple-chariot across the sky. Built from laterite, khondalite, and chlorite stone with iron beams reinforcing its structure, this masterpiece represented the pinnacle of Kalinga architecture and artistry.",
      damaged:
        "Centuries of salt wind from the Bay of Bengal wore the stone thin. The main spire collapsed long ago, and colonial-era engineers filled the sanctum with sand in 1904 to keep the remaining walls standing. Today, visitors come not just to witness the ruins, but to understand the transformation of this great monument through time—from its glorious reconstruction as a complete temple-chariot to its present weathered state, which itself tells a story of resilience and cultural continuity.",
    },
    location: { type: "Point", coordinates: [86.0945, 19.8876] },
    radiusMeters: 800,
    models: {
      damagedUrl: "",
      restoredUrl: "/models/konark_restored.glb",
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
  };

  try {
    const result = await Monument.findOneAndUpdate({ slug: "konark" }, { $set: konarkUpdate }, { new: true });
    console.log("✓ Konark monument updated successfully with complete history");
    console.log(`  - Restored description added`);
    console.log(`  - Damaged description added`);
    console.log(`  - Model URL: ${result.models.restoredUrl}`);
  } catch (err) {
    console.error("Failed to update Konark:", err.message);
    process.exit(1);
  }

  await mongoose.connection.close();
}

updateKonark().catch((err) => {
  console.error("Update failed:", err);
  process.exit(1);
});
