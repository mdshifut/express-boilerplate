const jwt = require('jsonwebtoken');

module.exports = (token, secret) => {
  let decoded;
  try {
    decoded = jwt.verify(token, secret);

    return { decoded };
  } catch (error) {
    const { message } = error;

    if (message === 'jwt expired') {
      const { payload } = jwt.decode(token, { complete: true });
      return { isExpired: true, decoded: payload };
    }
  }
  return { isInvalid: true };
};
