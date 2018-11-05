let socket = io();

const scrollToBottom = () => {
  const messages = $('#messages');
  const newMessage = messages.children('li:last-child');
  const clientHeight = messages.prop('clientHeight');
  const scrollTop = messages.prop('scrollTop');
  const scrollHeight = messages.prop('scrollHeight');
  const newMessageHeight = newMessage.innerHeight();
  const lastMessageHeight = newMessage.prev().innerHeight();
  if (
    clientHeight + scrollTop + newMessageHeight + lastMessageHeight >=
    scrollHeight
  ) {
    messages.scrollTop(scrollHeight);
  }
};

socket.on('connect', () => {
  const params = $.deparam(window.location.search);
  socket.emit('join', params, (err) => {
    if (err) {
      alert(err);
      window.location.href = '/';
    } else {
      console.log('No error');
    }
  });
});

socket.on('disconnect', () => console.log('Disconnected from server'));

socket.on('updateUserList', (users) => {
  const ol = $('<ol></ol>');
  users.forEach((user) => {
    ol.append($('<li></li>').text(user));
  });
  $('#users').html(ol);
});

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
  scrollToBottom();
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
  scrollToBottom();
});

$('#message-form').on('submit', (e) => {
  e.preventDefault();
  const messageTextBox = $('[name=message]');
  socket.emit(
    'createMessage',
    {
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
