import mongoose from "mongoose";
import { _config } from "./config.js";

const connectdb = async () => {
  try {
    const mongoUri = _config.MONGO_URI || "mongodb+srv://awscode1210:HTUMM8M4eZXQBWEb@cluster0.injn6ew.mongodb.net/yourDatabaseName"; // Replace 'yourDatabaseName' with your actual DB name

    mongoose.connection.on("connected", () => {
      console.log("MongoDB successfully connected!!");
    });

    mongoose.connection.on("error", (err) => {
      console.log("Connection error in DB:", err);
    });

    await mongoose.connect(mongoUri, {
      useNewUrlParser: true, 
      useUnifiedTopology: true,
    });

  } catch (error) {
    console.log("MongoDB connection error:", error);
    process.exit(1);
  }
};

export default connectdb;
