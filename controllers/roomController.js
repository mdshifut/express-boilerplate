const config = require('config');
const createError = require('http-errors');
const validateObjectId = require('../utils/validateObjectId');
const Room = require('../models/Room');

exports.addRoom = (req, res, next) => {
  const { firstName, lastName, email, password } = req.locals.validateValue;
};
