const generateMessage = (from, text) => ({
  from,
  text,
  createdAt: new Date().getTime()
});

const generateLocationMessage = (from, latitude, longitude) => ({
  from,
  url: `https://www.google.com/maps?q=${latitude},${longitude}`,
  createdAt: new Date().getTime()
});

module.exports = { generateMessage, generateLocationMessage };
