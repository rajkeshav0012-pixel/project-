const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 3000, // Reduced from 5s to fail faster if local DB isn't running
    });
    isConnected = true;
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.log("⚠️  Local MongoDB not found. Spinning up in-memory MongoDB...");
    try {
      // Connect to an in-memory database if local is not available
      const mongoServer = await MongoMemoryServer.create();
      const mongoUri = mongoServer.getUri();
      
      const conn = await mongoose.connect(mongoUri);
      isConnected = true;
      console.log(`✅ In-Memory MongoDB connected: ${conn.connection.host}`);
      console.log(`   (Note: Data will be reset when the server restarts. Install local MongoDB for persistent storage.)`);
    } catch (memError) {
      console.error("❌ Failed to start in-memory MongoDB:", memError.message);
      process.exit(1);
    }
  }
};

module.exports = connectDB;

