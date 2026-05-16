import express from "express";
import dotenv from "dotenv";
import sequelize from "./config/db.js";
import Book from "./models/book.js";

dotenv.config({
  path: "/Users/almiratolstova/Documents/Projects/ICH/node_hw/hw_8/.env",
});

const app = express();
const PORT = process.env.PORT || 3333;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello Sequelize + Express");
});

app.listen(PORT, async () => {
  try {
    await sequelize.authenticate();

    console.log("Database connected successfully.");
    console.log(`Server running on http://localhost:${PORT}`);
  } catch (error) {
    console.log("Database connection error:", error);
  }
});

app.get("/books", async (req, res) => {
  const books = await getBooks();
  if (books !== undefined) {
    res
      .json({
        status: "success",
        message: "Successfull got books list!",
        data: {
          books,
        },
      })
      .status(200);
  } else {
    res
      .json({
        status: "error",
        message: "error with getting books",
        data: {},
      })
      .status(400);
  }
});

app.post("/books", async (req, res) => {
  const { title, author, year } = req.body;
  if (
    (title !== undefined && title.length > 0 && author !== undefined) ||
    (author.length > 0 && year !== undefined)
  ) {
    const newBook = await createBook(title, author, year);
    if (newBook !== undefined) {
      res
        .json({
          status: "success",
          message: "Successfull created new Book!",
          data: {
            newBook,
          },
        })
        .status(200);
    } else {
      res
        .json({
          status: "error",
          message: "server error",
          data: {},
        })
        .status(500);
    }
  } else {
    res
      .json({
        status: "error",
        message: "invalid parameters",
        data: {},
      })
      .status(400);
  }
});

app.put("/books/:id", async (req, res) => {
  const bookId = req.params.id;
  const { title, author, year } = req.body;
  const result = await updateBook(bookId, title, author, year);
  if (result > 0) {
    res
      .json({
        status: "success",
        message: "Successfull changed book!",
        data: {
          result,
        },
      })
      .status(200);
  } else {
    res
      .json({
        status: "unsuccessfull",
        message: "book was not changed",
        data: {},
      })
      .status(400);
  }
});

app.delete("/books/:id", async (req, res) => {
  const bookId = Number(req.params.id);
  const result = await deleteBook(bookId);
  if (result > 0) {
    res
      .json({
        status: "success",
        message: "Successfull deleted book!",
        data: {
          result,
        },
      })
      .status(200);
  } else {
    res
      .json({
        status: "unsuccessfull",
        message: "book was not deleted",
        data: {},
      })
      .status(400);
  }
});

async function createBook(title, author, year) {
  try {
    const newBook = await Book.create({
      title: title,
      author: author,
      year: year,
    });
    console.log("Book created", newBook.toJSON);
    return newBook;
  } catch (error) {
    console.error("Failed to create book:", error);
  }
}
async function getBooks() {
  try {
    const books = await Book.findAll();
    console.log("All books");
    return books;
  } catch (error) {
    console.error("Error finding books:", error);
    return undefined;
  }
}

async function updateBook(bookId, title, author, year) {
  try {
    const [updatedRowsCount] = await Book.update(
      {
        title: title,
        author: author,
        year: year,
      },
      { where: { id: bookId } },
    );
    return updatedRowsCount;
  } catch (error) {
    return undefined;
  }
}

async function deleteBook(bookId) {
  try {
    const updatedRowsCount = await Book.destroy({ where: { id: bookId } });
    return updatedRowsCount;
  } catch (error) {
    return undefined;
  }
}
