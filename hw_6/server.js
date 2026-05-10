import express from "express";
import dotenv from "dotenv";
import connection from "./db/setup.js";
import cors from "cors";

dotenv.config();

const app = express();
const port = process.env.PORT || 3333;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get("/", (req, res, next) => {
  res.send("Hello world!");
});

app.get("/user/:id", (req, res, next) => {
  try {
    const userId = Number(req.params.id);
    if (isNaN(userId)) {
      const error = new Error("Invalid id");
      error.status = 404;
      return next(error);
    } else {
      res.send(`User ID: ${userId}`);
    }
  } catch (error) {
    next(error);
  }
});

app.post("/userdata", (req, res, next) => {
  try {
    const { username, email } = req.body;
    if (username === undefined || email === undefined) {
      const error = new Error("Invalid data");
      error.status = 404;
      return next(error);
    } else {
      res.json(`Username: ${username}, Email: ${email}`);
    }
  } catch (error) {
    next(error);
  }
});

//task 5
app.get("/products", (req, res, next) => {
  try {
    const query = `
        SELECT * FROM product_db.products;
    `;
    connection.query(query, (err, results) => {
      if (err) {
        return next(err);
      }

      res.json(results);
    });
  } catch (error) {
    next(error);
  }
});

app.post("/products", (req, res, next) => {
  const { name, price } = req.body;

  if (!name || price === undefined) {
    return res.status(400).json({
      error: "Name and price are required",
    });
  }

  const query = `
    INSERT INTO product_db.products (name, price)
    VALUES (?, ?)
  `;

  connection.query(query, [name, price], (err, results) => {
    if (err) {
      return next(err);
    }
    console.log(results);

    try {
      const query = `
        SELECT * FROM product_db.products;
    `;
      connection.query(query, (err, results) => {
        if (err) {
          return next(err);
        }

        res.json(results);
      });
    } catch (error) {
      next(error);
    }
  });
});

app.listen(port, () => {
  console.log(`Server running at http://127.0.0.1:${port} `);
});
