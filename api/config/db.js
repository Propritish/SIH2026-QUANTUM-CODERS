import mongoose from "mongoose";

// Mongoose connection handler. Caches the connection promise on `global`
// so serverless invocations (Vercel) reuse it across warm starts instead
// of opening a fresh connection per request.
let cached = global._mongooseConnPromise;

export async function connectDB() {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI environment variable is not set.");
  }

  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (!cached) {
    cached = mongoose.connect(process.env.MONGODB_URI, {
      dbName: process.env.MONGODB_DB || "odisha_ar_heritage",
    });
    global._mongooseConnPromise = cached;
  }

  await cached;
  return mongoose.connection;
}
