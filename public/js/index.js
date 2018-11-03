let socket = io();

socket.on('connect', () => {
  console.log('Connected to server');

  socket.emit('createMessage', {
    from: 'user@create',
    text: 'createMessage'
  });
});

socket.on('disconnect', () => console.log('Disconnected from server'));

socket.on('newMessage', (newMessage) => {
  console.log('New message', newMessage);
});
