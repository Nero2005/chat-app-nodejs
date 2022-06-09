import "dotenv/config";
import mongoose from "mongoose";

export const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.DB_CONNECTION);
    console.log("Database Connection Successful");
  } catch (e) {
    console.log(e);
    process.exit(1);
  }
}
