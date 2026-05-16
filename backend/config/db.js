const mongoose = require("mongoose");

let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;

  const uri = process.env.MONGODB_URI;

  // No URI set — will fall back to in-memory MongoDB below
  if (!uri) {
    console.warn("⚠️  No MONGODB_URI set — using in-memory MongoDB (data resets on restart)");
    console.warn("   👉 Add MONGODB_URI in Render environment variables for persistent storage");
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
