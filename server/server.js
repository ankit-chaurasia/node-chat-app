const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const { generateMessage } = require('./utils/message');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
let app = express();

app.use(express.static(publicPath));

let server = http.createServer(app);

let io = socketIO(server);

io.on('connection', (socket) => {
  console.log('New user connected');

  socket.emit(
    'newMessage',
    generateMessage('Admin', 'Welcome to the chat app')
  );

  socket.broadcast.emit(
    'newMessage',
    generateMessage('Admin', 'New user joined')
  );

  socket.on('createMessage', (newMessage) => {
    console.log('New message', newMessage);
    io.emit('newMessage', generateMessage(newMessage.from, newMessage.text));
    socket.broadcast.emit(
      'newMessage',
      generateMessage(newMessage.from, newMessage.text)
    );
    socket.emit(
      'newMessage',
      generateMessage(newMessage.from, newMessage.text)
    );
  });

  socket.on('disconnect', () => console.log('User was disconnected'));
});

server.listen(port, () => {
  console.log(`server is up on port ${port}`);
});
