const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173", // Permitir solicitudes desde el frontend (Vite)
    methods: ["GET", "POST"], // Métodos permitidos
  },
});

app.get("/", (req, res) => {
  res.send("Servidor de juego funcionando");
});

// Conexión de Socket.io
io.on("connection", (socket) => {
  console.log("Nuevo cliente conectado");

  // Escuchar eventos
  socket.on("mensaje", (data) => {
    console.log("Mensaje recibido del cliente:", data);
    io.emit("mensaje", data); // Emitir respuesta a todos los clientes
  });

  socket.on("disconnect", () => {
    console.log("Un cliente se desconectó");
  });
});

// Iniciar el servidor en el puerto 5000
server.listen(5000, () => {
  console.log("Servidor funcionando en http://localhost:5000");
});
