import mongoose from "mongoose";

export const connectDB = async () => {
  const uri = process.env.MONGO_URI ?? process.env.MONGODB_URI ?? "mongodb://localhost:27017/tcg-bot-simulator";
  if (!uri) throw new Error("MONGO_URI not set");

  const opts = {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 20000
  };

  await mongoose.connect(uri, opts);

  console.log(`✅ MongoDB Connected: ${mongoose.connection.host}`);

  mongoose.connection.on("error", (err) => {
    console.error("❌ MongoDB connection error:", err);
  });

  mongoose.connection.on("disconnected", () => {
    console.log("⚠️  MongoDB disconnected");
  });

  process.on("SIGINT", async () => {
    await mongoose.connection.close();
    console.log("🔄 MongoDB connection closed through app termination");
    process.exit(0);
  });
};
