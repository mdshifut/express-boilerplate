const mongoose = require('mongoose');
const _ = require('lodash');
const createError = require('http-errors');
const Admin = require('../models/Admin');

module.exports = async (req, res, next) => {
  let currentUser = null;
  const user =
    req.params.adminId ||
    req.locals.validateValue.email ||
    req.locals.authUser._id;

  // Catch user type _id
  if (mongoose.Types.ObjectId.isValid(user)) {
    currentUser = await Admin.findById(user);
  } else {
    currentUser = await Admin.findOne({ email: user });
  }

  if (!currentUser) return next(createError(404, 'User not found'));

  _.set(req, 'locals.currentUser', currentUser);
  return next();
};
