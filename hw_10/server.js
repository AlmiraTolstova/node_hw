import express from "express";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import logRequest from "./middlewares/logger.js";
import authenticateJWT from "./middlewares/auth.js";

dotenv.config({
  path: "/Users/almiratolstova/Documents/Projects/ICH/node_hw/hw_10/.env",
});

const app = express();
const port = process.env.PORT || 3333;

app.use(express.json());

app.use(logRequest);

// тестовые пользователи
let users = [
  {
    id: "1",
    username: "User1",
    email: "user1@gmail.com",
    password: await bcrypt.hash("123456", 10),
  },
  {
    id: "2",
    username: "User2",
    email: "user2@gmail.com",
    password: await bcrypt.hash("0000000", 10),
  },
];

// LOGIN
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = users.find((user) => user.email === email);

    if (!user) {
      return res.status(401).json({
        message: "Неверный email или пароль",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Неверный email или пароль",
      });
    }

    // создаём JWT
    const token = jwt.sign(
      {
        userId: user.id,
        username: user.username,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      },
    );

    return res.status(200).json({
      message: "Успешный вход",
      token,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Ошибка сервера",
    });
  }
});

app.post("/update-email", authenticateJWT, (req, res) => {
  const { newEmail } = req.body;
  const userId = req.user.userId;
  const user = users.find((user) => user.id === userId);
  if (user) {
    user.email = newEmail;

    res.status(201).json({ success: true, data: { user } });
  } else {
    return res.status(500).json({ error: "User not found" });
  }
});

app.get("/users", authenticateJWT, (req, res) => {
  res.json(users);
});

app.delete("/delete-account/:id", authenticateJWT, (req, res) => {
  const userId = req.params.id;
  users = users.filter((item) => item.id !== userId);
  res.json({
    message: `Пользователь ${userId} удалён`,
  });
});

app.listen(port, () => {
  console.log(`Сервер запущен: http://127.0.0.1:${port}`);
});
