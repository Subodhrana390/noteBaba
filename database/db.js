import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const mongoUrl = process.env.MONGO_URL;

const dbConnect = async () => {
  try {
    if (!mongoUrl) {
      throw new Error("MongoDB URL is missing in .env file.");
    }

    await mongoose.connect(mongoUrl, {
      dbName: "Dream_Nest",
    });

    console.log("MongoDB Connected Successfully!");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err.message);
    process.exit(1);
  }
};

dbConnect();

export default dbConnect;
