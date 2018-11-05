const expect = require('expect');
const { isRealString } = require('./validations');

describe('isRealString', () => {
  it('should reject non-string values', () => {
    const res = isRealString(98);
    expect(res).toBeFalsy();
  });

  it('should reject string with only spaces', () => {
    const res = isRealString('     ');
    expect(res).toBeFalsy();
  });

  it('should allow string with non-spaces characters', () => {
    const res = isRealString('   test    ');
    expect(res).toBeTruthy();
  });
});
