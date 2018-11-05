const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const { generateMessage, generateLocationMessage } = require('./utils/message');
const { isRealString } = require('./utils/validations');
const { Users } = require('./utils/users');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
let app = express();

app.use(express.static(publicPath));

let server = http.createServer(app);

let io = socketIO(server);

const users = new Users();

io.on('connection', (socket) => {
  console.log('New user connected');

  socket.on('join', ({ name, room }, callback) => {
    if (!isRealString(name) || !isRealString(room)) {
      return callback('Name and Room name are required');
    }
    socket.join(room);
    users.removeUser(socket.id);
    users.addUser(socket.id, name, room);
    io.to(room).emit('updateUserList', users.getUserList(room));
    socket.emit(
      'newMessage',
      generateMessage('Admin', 'Welcome to the chat app')
    );
    socket.broadcast
      .to(room)
      .emit('newMessage', generateMessage('Admin', `${name} has joined`));
    callback();
  });

  socket.on('createMessage', (newMessage, callback) => {
    io.emit('newMessage', generateMessage(newMessage.from, newMessage.text));
    callback();
  });

  socket.on('createLocationMessage', ({ latitude, longitude }) => {
    io.emit(
      'newLocationMessage',
      generateLocationMessage('Admin', latitude, longitude)
    );
  });

  socket.on('disconnect', () => {
    console.log('User was disconnected');
    const user = users.removeUser(socket.id);
    if (user) {
      io.to(user.room).emit('updateUserList', users.getUserList(user.room));
      io.to(user.room).emit(
        'newMessage',
        generateMessage('Admin', `${user.name} has left`)
      );
    }
  });
});

server.listen(port, () => {
  console.log(`server is up on port ${port}`);
});
