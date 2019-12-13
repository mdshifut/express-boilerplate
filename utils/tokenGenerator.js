const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = async ({ _id, valid = '1d' }) => {
  return jwt.sign({ _id }, config.get('JWT_SECRET_KEY'), {
    expiresIn: valid
  });
};
