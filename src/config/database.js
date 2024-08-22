import mongoose from "mongoose";
import { _config } from "./config.js";

const connectdb = async () => {
  try {
    mongoose.connection.on("connected", () => {
      console.log("mongodb successfully connected!!");
    });

    mongoose.connection.on("error", (err) => {
      console.log("connection error in db ", err);
    });

    await mongoose.connect("mongodb+srv://awscode1210:HTUMM8M4eZXQBWEb@cluster0.injn6ew.mongodb.net/");
  } catch (error) {
    console.log("mongodb connection errror : ", error);

    process.exit(1);
  }
};

export default connectdb;
