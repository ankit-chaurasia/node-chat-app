let socket = io();

socket.on('connect', () => {
  console.log('Connected to server');
});

socket.on('disconnect', () => console.log('Disconnected from server'));

socket.on('newMessage', (newMessage) => {
  console.log('New message', newMessage);
  const { from, text } = newMessage;
  let li = $('<li></li>');
  li.text(`${from}: ${text}`);
  $('#messages').append(li);
});

socket.on('newLocationMessage', (newLocationMessage) => {
  const { from, url } = newLocationMessage;
  let li = $('<li></li>');
  let a = $('<a target="_blank">My Current Location</a>');
  li.text(`${from}: `);
  a.attr('href', url);
  li.append(a);
  $('#messages').append(li);
});

$('#message-form').on('submit', (e) => {
  e.preventDefault();
  socket.emit(
    'createMessage',
    {
      from: 'user',
      text: $('[name=message]').val()
    },
    (data) => {
      console.log('Got it', data);
    }
  );
});

const locationButton = $('#send-location');

locationButton.on('click', () => {
  if (!navigator.geolocation) {
    return alert('Geolocation not supported by your browser');
  }
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      socket.emit('createLocationMessage', {
        latitude,
        longitude
      });
    },
    () => alert('Unable to fetch location')
  );
});
