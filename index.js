const express = require('express');
const { Server } = require('socket.io');
const { createServer } = require('http');
const { join } = require('path');

const app = express();
const server = createServer(app);
const io = new Server(server);
const port = 3000;

const users = {}; // Use object for easy socket.id access

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'index.html'));
});

io.on('connection', (socket) => {
  console.log(` User connected: ${socket.id}`);

  // Receive location
  socket.on('coordinates', ({ lat, lng }) => {
    users[socket.id] = { id: socket.id, lat, lng };
    io.emit('locations', Object.values(users));
  });

  socket.on('disconnect', () => {
    console.log(` User disconnected: ${socket.id}`);
    delete users[socket.id];
    io.emit('locations', Object.values(users)); // update others
  });
});

server.listen(port, () => {
  console.log(` Server running at http://localhost:${port}`);
});
