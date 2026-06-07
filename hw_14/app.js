import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "./db/index.js";
import Product from "./models/Product.js";
import Category from "./models/Category.js";

// import cartRoutes from "./routes/cartRoutes.js";

dotenv.config();

const app = express();

const dbURI = process.env.MONGO_URI || "url";
const port = process.env.PORT || 3000;

app.use(express.json());

connectDB();

// CREATE POST /products
app.post("/products", async (req, res) => {
  try {
    const product = await Product.create(req.body);

    res.status(201).json({
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    res.status(400).json({
      message: "Failed to create product",
      error: error.message,
    });
  }
});

// CREATE CATEGORY
app.post("/categories", async (req, res, next) => {
  try {
    const category = await Category.create(req.body);
    res.status(201).json(category);
  } catch (error) {
    next(error);
  }
});

// GET /products Использование populate
app.get("/products", async (req, res) => {
  try {
    let products = await Product.find().populate("category");

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({
      message: "Error getting products",
      error: error.message,
    });
  }
});

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
