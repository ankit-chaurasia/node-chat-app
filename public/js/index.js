let socket = io();

socket.on('connect', () => {
  console.log('Connected to server');
});

socket.on('disconnect', () => console.log('Disconnected from server'));

socket.on('newMessage', (newMessage) => {
  console.log('New message', newMessage);
});

socket.emit(
  'createMessage',
  {
    from: 'user@createMessage',
    text: 'createMessage text'
  },
  (data) => {
    console.log('Got it', data);
  }
);
