import http from 'node:http';
import { Server } from 'socket.io';
import path from 'node:path';
import express from 'express';

async function main() {
  const app = express();
  app.use(express.static(path.resolve('./public')));

  const server = http.createServer(app);
  const io = new Server(server);


    

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('chat message', (msg) => {
      io.emit('chat message', msg); // broadcast to everyone
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });

  server.listen(9000, () => {
    console.log('HTTP server is running on PORT 9000');
  });
}

main();