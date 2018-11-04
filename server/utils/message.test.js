let expect = require('expect');
const { generateMessage, generateLocationMessage } = require('./message');

describe('generateMessage', () => {
  it('should generate correct message object', () => {
    const from = 'test@from';
    const text = 'some message';
    const message = generateMessage(from, text);

    expect(typeof message.createdAt).toBe('number');
    expect(message).toMatchObject({
      from,
      text
    });
  });
});

describe('generateLocationMessage', () => {
  it('should generate correct location object', () => {
    const from = 'test';
    const latitude = '15';
    const longitude = '20';
    const url = `https://www.google.com/maps?q=${latitude},${longitude}`;
    const message = generateLocationMessage(from, latitude, longitude);

    expect(typeof message.createdAt).toBe('number');
    expect(message).toMatchObject({
      from,
      url
    });
  });
});
