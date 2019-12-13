const jwt = require('jsonwebtoken');
const generateAccessToken = require('./generateAccessToken');

describe('generateAccessToken', () => {
  const data = {
    _id: '5dee4dc1247f3d78c4374f34',
    profile: { firstName: 'Shifut', lastName: 'Hossain' },
    email: 'mdshifut@gamil.com'
  };
  it('should create access token return it', async () => {
    expect.hasAssertions();

    const accessToken = await generateAccessToken(data);

    const decode = await jwt.decode(accessToken);

    expect(decode).toHaveProperty('user.name', 'Shifut Hossain');
    expect(decode).toHaveProperty('user.email', 'mdshifut@gamil.com');
    expect(decode).toHaveProperty('user._id', '5dee4dc1247f3d78c4374f34');
  });

  it('should create access token and add role return it', async () => {
    expect.hasAssertions();

    const accessToken = await generateAccessToken({
      ...data,
      role: 'ROOT_ADMIN'
    });

    const decode = await jwt.decode(accessToken);

    expect(decode).toHaveProperty('user.name', 'Shifut Hossain');
    expect(decode).toHaveProperty('user.email', 'mdshifut@gamil.com');
    expect(decode).toHaveProperty('user._id', '5dee4dc1247f3d78c4374f34');
    expect(decode).toHaveProperty('user.role', 'ROOT_ADMIN');
  });
});
