const mongoose = require("mongoose");

let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;

  const uri = process.env.MONGODB_URI;

  // In production, a missing URI is fatal — do not silently fall back
  if (!uri && process.env.NODE_ENV === "production") {
    console.error("❌ MONGODB_URI is not set. Exiting.");
    process.exit(1);
  }

  // ── Try connecting to the configured URI ───────────────────────────────────
  if (uri) {
    try {
      const conn = await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 5000,
      });
      isConnected = true;
      console.log(`✅ MongoDB connected: ${conn.connection.host}`);
      return;
    } catch (error) {
      console.error("❌ MongoDB connection failed:", error.message);
      // In production stop here — don't fall back to in-memory
      if (process.env.NODE_ENV === "production") process.exit(1);
    }
  }

  // ── Dev fallback: in-memory MongoDB ───────────────────────────────────────
  console.log("⚠️  No MONGODB_URI or connection failed — starting in-memory MongoDB for dev...");
  try {
    const { MongoMemoryServer } = require("mongodb-memory-server");
    const mongoServer = await MongoMemoryServer.create();
    const conn = await mongoose.connect(mongoServer.getUri());
    isConnected = true;
    console.log(`✅ In-Memory MongoDB started (data resets on restart)`);
    console.log(`   👉 Set MONGODB_URI in backend/.env for persistent storage`);
  } catch (memError) {
    console.error("❌ Failed to start in-memory MongoDB:", memError.message);
    process.exit(1);
  }
};

module.exports = connectDB;
