import express from "express";
import { connectToDatabase, getDb } from "./db/config.js";
import { ObjectId } from "mongodb";

const app = express();
const port = process.env.PORT || 3000;

//DB CONNECTION
connectToDatabase()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running at http://127.0.0.1:${port}`);
    });
  })
  .catch((err) => {
    console.error("Failed to start server due to MongoDB error", err);
  });

// MIDDLEWARE

app.use(express.json());

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

//TEST ROUTE

app.get("/", (req, res) => {
  res.send("Hello world!");
});

// CREATE product
app.post("/products", async (req, res) => {
  try {
    const db = getDb();
    const product = req.body;

    if (!product.name || !product.price || !product.description) {
      return res
        .status(400)
        .json({ error: "Name,price or description are required" });
    }

    const result = await db.collection("products").insertOne(product);

    res.status(201).json({ data: result });
  } catch (error) {
    res.status(500).json({ error: "Failed to create product" });
  }
});

// GET all products
app.get("/products", async (req, res) => {
  try {
    const db = getDb();
    const products = await db.collection("products").find().toArray();

    res.status(200).json({ products });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// GET one product
app.get("/products/:id", async (req, res) => {
  try {
    const db = getDb();
    const productId = req.params.id;

    if (!ObjectId.isValid(productId)) {
      return res.status(400).json({ error: "Invalid product ID" });
    }

    const product = await db
      .collection("products")
      .findOne({ _id: new ObjectId(productId) });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch product" });
  }
});

// UPDATE product
app.put("/products/:id", async (req, res) => {
  try {
    const db = getDb();
    const productId = req.params.id;
    const updateData = req.body;

    if (!ObjectId.isValid(productId)) {
      return res.status(400).json({ error: "Invalid product ID" });
    }

    const result = await db
      .collection("products")
      .updateOne({ _id: new ObjectId(productId) }, { $set: updateData });

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json({ message: "Product updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to update product" });
  }
});

// DELETE product
app.delete("/products/:id", async (req, res) => {
  try {
    const db = getDb();
    const productId = req.params.id;

    if (!ObjectId.isValid(productId)) {
      return res.status(400).json({ error: "Invalid product ID" });
    }

    const result = await db
      .collection("products")
      .deleteOne({ _id: new ObjectId(productId) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete product" });
  }
});
