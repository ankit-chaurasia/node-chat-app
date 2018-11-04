let socket = io();

socket.on('connect', () => {
  console.log('Connected to server');
});

socket.on('disconnect', () => console.log('Disconnected from server'));

socket.on('newMessage', (newMessage) => {
  const { from, text, createdAt } = newMessage;
  const formattedTime = moment(createdAt).format('h:mm a');
  const template = $('#message-template').html();
  const html = Mustache.render(template, {
    from,
    text,
    createdAt: formattedTime
  });
  $('#messages').append(html);
});

socket.on('newLocationMessage', (newLocationMessage) => {
  const { from, url, createdAt } = newLocationMessage;
  const formattedTime = moment(createdAt).format('h:mm a');
  const template = $('#location-message-template').html();
  const html = Mustache.render(template, {
    from,
    url,
    createdAt: formattedTime
  });
  $('#messages').append(html);
});

$('#message-form').on('submit', (e) => {
  e.preventDefault();
  const messageTextBox = $('[name=message]');
  socket.emit(
    'createMessage',
    {
      from: 'User',
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
