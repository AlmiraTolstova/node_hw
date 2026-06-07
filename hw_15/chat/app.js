const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

// Инициализация Express приложения
const app = express();

// Создаем HTTP-сервер на базе Express
const server = http.createServer(app);

// Инициализируем Socket.io, передавая ему созданный сервер
const io = new Server(server);

// Настраиваем Express для отдачи статических файлов из папки "public"
app.use(express.static(path.join(__dirname, "public")));

// Обработка WebSocket-соединений
io.on("connection", (socket) => {
  console.log(`Пользователь подключился! ID сокета: ${socket.id}`);

  // Слушаем событие 'chat message' от конкретного клиента
  socket.on("chat message", (msg) => {
    console.log(`Получено сообщение от [${socket.id}]: ${msg}`);

    // Отправляем сообщение обратно ВСЕМ подключенным пользователям (включая отправителя)
    io.emit("chat message", msg);

    // Отправляем персональное подтверждение обратно клиенту, который прислал сообщение
    socket.emit(
      "server confirmation",
      "Сообщение успешно доставлено на сервер!",
    );
  });

  // Обработка отключения пользователя
  socket.on("disconnect", () => {
    console.log(`Пользователь отключился. ID сокета: ${socket.id}`);
  });
});

// Запуск сервера на порту 3000
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Сервер запущен и доступен по адресу: http://localhost:${PORT}`);
});
