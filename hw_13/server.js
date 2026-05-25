import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import Publisher from "./models/Publisher.js";
import Magazine from "./models/Magazine.js";
import Tag from "./models/Tag.js";
import Article from "./models/Article.js";

dotenv.config();

const app = express();

const dbURI = process.env.MONGO_URI || "url";
const port = process.env.PORT || 3000;

startServer();

async function startServer() {
  try {
    await mongoose.connect(dbURI);

    console.log("Successfully connected to MongoDB!");
    app.listen(port, () => {
      console.log(`Server started at http://127.0.0.1:${port}`);
    });
  } catch (error) {
    console.error(error);
  }
}
