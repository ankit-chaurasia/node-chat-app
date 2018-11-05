const expect = require('expect');

const { Users } = require('./users');

describe('Users', () => {
  let users;
  beforeEach(() => {
    users = new Users();
    users.users = [
      {
        id: '1',
        name: 'Mike',
        room: 'Node course'
      },
      {
        id: '2',
        name: 'Jen',
        room: 'React course'
      },
      {
        id: '3',
        name: 'Juile',
        room: 'Node course'
      }
    ];
  });

  it('should add new user', () => {
    const users = new Users();
    const user = {
      id: '123',
      name: 'Ankit',
      room: 'The Office Fans'
    };
    const resUser = users.addUser(user.id, user.name, user.room);
    expect(users.users).toEqual([user]);
  });

  it('should remove a user', () => {
    const userId = '2';
    const user = users.removeUser(userId);
    expect(user.id).toBe(userId);
    expect(users.users.length).toBe(2);
  });

  it('should not remove user', () => {
    const userId = '99';
    const user = users.removeUser(userId);
    expect(user).toBeFalsy();
    expect(users.users.length).toBe(3);
  });

  it('should find user', () => {
    const userId = '2';
    const user = users.getUser(userId);
    expect(user.id).toBe(userId);
  });

  it('should not find user', () => {
    const userId = '99';
    const user = users.getUser(userId);
    console.log('user', user);
    expect(user).toBeFalsy();
  });

  it('should return users in the provided room', () => {
    const userList = users.getUserList('Node course');
    expect(userList).toEqual(['Mike', 'Juile']);
  });
});
