import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const db = process.env.MONGO_URI;

const connectDB = async () => {
  try {
    let dbConnected = await mongoose.connect(db);
    console.log("MongoDB Database is Connected", dbConnected.connection.host);
    console.log("MongoDB Database is Connected", dbConnected.connection.port);
  } catch (err) {
    console.log("Something Went Wrong", err.message);
    process.exit(1);
  }
};

export default connectDB;
