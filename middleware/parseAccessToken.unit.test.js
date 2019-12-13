const parseAccessToken = require('./parseAccessToken');
const generateAccessToken = require('../utils/generateAccessToken');

describe('parseAccessToken', () => {
  it('should not attach authUser if cookies do not have a access token', () => {
    expect.hasAssertions();
    const next = jest.fn();
    parseAccessToken({ cookies: {} }, {}, next);
    expect(next).toHaveBeenCalledTimes(1);
  });

  it('should not attach authUser if cookies have a invalid or expired access token', () => {
    expect.hasAssertions();
    const next = jest.fn();
    const req = {
      cookies: {
        'x-access-token':
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
      }
    };
    const res = { clearCookie: jest.fn() };

    parseAccessToken(req, res, next);
    expect(res.clearCookie).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledTimes(1);
    expect(req).not.toHaveProperty('locals.authUser');
  });

  it('should  attach authUser if cookies have a valid access token', () => {
    expect.hasAssertions();
    const user = {
      _id: '5dee4dc1247f3d78c4374f34',
      role: 'ROOT_ADMIN',
      email: 'mdshifut@gmail.com',
      profile: { firstName: 'Shifut', lastName: 'Hossain' }
    };
    const accessToken = generateAccessToken(user);
    const next = jest.fn();

    const req = {
      cookies: {
        'x-access-token': accessToken
      }
    };
    const res = {};

    parseAccessToken(req, res, next);
    expect(next).toHaveBeenCalledTimes(1);
    expect(req).toHaveProperty('locals.authUser._id', user._id);
  });
});
