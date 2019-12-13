const createError = require('http-errors');
const Admin = require('../models/Admin');

module.exports = (...allowed) => async (req, res, next) => {
  const adminId = req.locals && req.locals.authUser && req.locals.authUser._id;

  const admin = await Admin.findById(adminId);

  if (admin && !admin.isDisable && allowed.indexOf(admin.role) > -1)
    return next();

  return next(
    createError(403, "Access denied. you aren't permitted to doing this action")
  );
};
