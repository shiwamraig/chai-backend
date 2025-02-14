import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";
import dotenv from "dotenv";

dotenv.config(); // Load .env before using process.env

// const MONGO_URI = process.env.MONGO_URI;
const MONGO_URI = `${process.env.MONGO_URI}/${DB_NAME}`;


const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB Connected to Database:", DB_NAME);
  } catch (error) {
    console.error("❌ MongoDB Connection Failed:", error.message);
    process.exit(1);
  }
};

export default connectDB;
