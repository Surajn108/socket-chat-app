import http from "node:http";
import path from "node:path";
import express from "express";
import { Server } from "socket.io";

const PORT = Number(process.env.PORT ?? 9000);

function isValidMessage(payload) {
  return (
    payload &&
    typeof payload === "object" &&
    typeof payload.text === "string" &&
    payload.text.trim().length > 0 &&
    payload.text.length <= 500
  );
}

async function main() {
  const app = express();
  app.use(express.static(path.resolve("./public")));

  const server = http.createServer(app);
  const io = new Server(server);

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("user:message", (data) => {
      if (!isValidMessage(data)) return;

      const msg = { text: data.text.trim(), at: Date.now() };
      socket.broadcast.emit("server:message", msg); // others only
      // If you want everyone (including sender): io.emit("server:message", msg);
    });

    socket.on("disconnect", (reason) => {
      console.log("User disconnected:", socket.id, reason);
    });
  });

  server.listen(PORT, () => {
    console.log(`HTTP server is running on PORT ${PORT}`);
  });
}

main();