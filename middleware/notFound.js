const createError = require('http-errors');

module.exports = (req, res, next) =>
  next(
    createError(
      404,
      'The requested URL was not found on the server.  If you entered the URL manually please check your spelling and try again.'
    )
  );
