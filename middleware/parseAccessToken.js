const config = require('config');
const _ = require('lodash');
const verifyToken = require('../utils/verifyToken');

module.exports = (req, res, next) => {
  const accessToken = req.cookies['x-access-token'];

  if (accessToken) {
    const { decoded } = verifyToken(accessToken, config.get('JWT_SECRET_KEY'));

    if (!decoded) {
      res.clearCookie('x-access-token');
      return next();
    }

    _.set(req, 'locals.authUser', decoded.user);
  }

  return next();
};
