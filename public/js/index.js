let socket = io();

socket.on('connect', () => {
  console.log('Connected to server');
});

socket.on('disconnect', () => console.log('Disconnected from server'));

socket.on('newMessage', (newMessage) => {
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
  const messageTextBox = $('[name=message]');
  socket.emit(
    'createMessage',
    {
      from: 'user',
      text: messageTextBox.val()
    },
    () => {
      messageTextBox.val('');
    }
  );
});

const locationButton = $('#send-location');

locationButton.on('click', () => {
  if (!navigator.geolocation) {
    return alert('Geolocation not supported by your browser');
  }
  locationButton.attr('disabled', 'disabled').text('Sending location...');
  navigator.geolocation.getCurrentPosition(
    (position) => {
      locationButton.removeAttr('disabled').text('Send Location');
      const { latitude, longitude } = position.coords;
      socket.emit('createLocationMessage', {
        latitude,
        longitude
      });
    },
    () => {
      locationButton.removeAttr('disabled').text('Send Location');
      alert('Unable to fetch location');
    }
  );
});
