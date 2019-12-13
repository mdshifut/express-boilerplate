const _ = require('lodash');
const createError = require('http-errors');

module.exports = (req, res, next) => {
  if (!_.has(req, 'locals.authUser'))
    return next(createError(401, 'Authentication failed. Please login'));
  return next();
};
