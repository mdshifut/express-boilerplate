/* eslint-disable no-console */
const createError = require('http-errors');
const logger = require('../logger/logger');

// eslint-disable-next-line no-unused-vars
module.exports = (err, req, res, next) => {
  let error;

  if (err instanceof createError.HttpError) {
    // handle http err
    error = {
      message: err.message,
      type: err.name,
      status: err.statusCode
    };

    if (err.details) error.details = err.details;
  } else {
    error = {
      message: 'Internal server error',
      status: 500,
      type: 'InternalServerError'
    };
    // Log error if error wasn't created by the http-error

    logger.error(err.stack);
  }

  if (process.env.NODE_ENV !== 'production') error.stack = err.stack;
  const statusCode = parseInt(error.status, 10);
  return res.status(statusCode).json({ error });
};
