const mongoose = require('mongoose');
const _ = require('lodash');
const createError = require('http-errors');
const User = require('../models/User');

module.exports = async (req, res, next) => {
  let currentUser = null;
  const user =
    req.params.userId ||
    req.locals.validateValue.email ||
    req.locals.authUser._id;

  // Catch user type _id
  if (mongoose.Types.ObjectId.isValid(user)) {
    currentUser = await User.findById(user);
  } else {
    currentUser = await User.findOne({ email: user });
  }

  if (!currentUser) return next(createError(404, 'User not found'));

  _.set(req, 'locals.currentUser', currentUser);
  return next();
};
