const bcrypt = require('bcrypt');
const config = require('config');
const generator = require('generate-password');
const createError = require('http-errors');
const tokenGenerator = require('../utils/tokenGenerator');
const mailSender = require('../mailer/mailSender');
const User = require('../models/User');
const verifyToken = require('../utils/verifyToken');
const generateAccessToken = require('../utils/generateAccessToken');
const validateObjectId = require('../utils/validateObjectId');

const APP_URL = config.get('APP_URL');
const JWT_SECRET_KEY = config.get('JWT_SECRET_KEY');

// ================================================================================
// =================================== Create  User ===========================
// ================================================================================
exports.createUser = async (req, res, next) => {
  const { firstName, lastName, email, password } = req.locals.validateValue;

  const emailExist = await User.findOne({
    email
  });

  // If email already exist
  if (emailExist) {
    return next(createError(406, 'Email already exist'));
  }

  //   Hash password
  const hash = await bcrypt.hash(password, 10);

  const user = new User({
    profile: {
      firstName,
      lastName
    },
    email,
    hashPassword: hash
  });

  // Create an assign activation token
  const activationToken = await tokenGenerator({ _id: user._id });

  await user.save();

  // TODO:Have to make template
  const template = `<a>${APP_URL}/User/active-account/${User._id}?token=${activationToken}</a>`;

  // Send mail to the user account
  await mailSender({
    subject: 'Active your account',
    email: user.email,
    template
  });

  return res.status(201).json({
    _id: user._id,
    message: 'Account created successfully. Please verify your email'
  });
};

// ================================================================================
// =================================== Resend activation ===========================
// ================================================================================

// Create new activation link or resend new activation link
exports.resendActivationLink = async (req, res, next) => {
  const { currentUser } = req.locals;

  // If the account already activated
  if (currentUser.isActivated)
    return next(
      createError(
        406,
        'Account already activated. Please login with Email and Password'
      )
    );

  // Generate new Activation token and to the user
  const activationToken = await tokenGenerator({ _id: currentUser._id });

  // generate template
  let template = '';
  if (currentUser.role === 'ROOT_User') {
    template = `<a>${APP_URL}/${currentUser._id}/active-account?token=${activationToken}</a>`;
  } else {
    // If user is sub User then generate new temporary password
    let tempPassword = '';
    // Create temporary password
    tempPassword = generator.generate({ numbers: true });

    //   Hash password
    currentUser.password = await bcrypt.hash(tempPassword, 10);
    await currentUser.save();

    template = `<a>${APP_URL}/${currentUser._id}/active-account?token=${activationToken}</a> <br/> Your temporary password is: ${tempPassword}`;
  }

  // Send new activation token to user email after saving user data and response back to the user
  await mailSender({
    email: currentUser.email,
    subject: 'Active your account',
    template
  });

  return res.status(200).json({
    UserId: currentUser._id,
    message: 'A new activation link has been sent to your email'
  });
};

/* ========================================================================
============================== Active account =============================
======================================================================== */

exports.activeAccount = async (req, res, next) => {
  const { token } = req.query;

  // verify the activation token
  const { isInvalid, isExpired, decoded } = verifyToken(token, JWT_SECRET_KEY);

  // If token is invalid
  if (isInvalid) return next(createError(406, 'Invalid activation token'));

  // If object id isn't valid
  if (!validateObjectId(decoded._id)) {
    return next(createError(406, 'Invalid ID'));
  }

  const currentUser = await User.findById(decoded._id);

  // If user not found
  if (!currentUser) return next(createError(404, 'User not found'));

  // If the user account already activated then send response to the user
  if (currentUser.isActivated)
    return next(
      createError(
        400,
        'Account already activated. Please login with your  Email and Password'
      )
    );

  // If token is expired then create new token and send it to the user email
  if (isExpired) {
    const activationToken = await tokenGenerator({ _id: currentUser._id });

    // generate template
    let template = '';
    if (currentUser.role === 'ROOT_User') {
      template = `<a>${APP_URL}/${currentUser._id}/active-account?token=${activationToken}</a>`;
    } else {
      let tempPassword = '';
      // Create temporary password
      tempPassword = generator.generate({ numbers: true });

      //   Hash password
      currentUser.password = await bcrypt.hash(tempPassword, 10);
      await currentUser.save();

      template = `<a>${APP_URL}/${currentUser._id}/active-account?token=${activationToken}</a> <br/> Your temporary password is: ${tempPassword}`;
    }

    // Send new activation token to user email after saving user data and response back to the user
    await mailSender({
      email: currentUser.email,
      subject: 'Active your account',
      template
    });

    return next(
      createError(
        406,
        'Activation link expired. A new activation link has been sent to your email'
      )
    );
  }

  // If all thing goes is Ok then active the user account

  currentUser.isActivated = true;
  await currentUser.save();

  // Response back to the user
  return res.status(200).json({
    message:
      'Account activated successfully. Now you can login with your Email and Password'
  });
};

/* ===============f=======================================================================
===================================== Login controller ==================================
========================================================================================= */
exports.login = async (req, res, next) => {
  const {
    currentUser,
    validateValue: { password }
  } = req.locals;

  // If user is disabled
  if (currentUser.isDisable)
    return next(createError(403, 'Your account has been disabled'));

  // If user account not activated
  if (!currentUser.isActivated) {
    // Generate new activation token
    const activationToken = await tokenGenerator({ _id: currentUser._id });

    // generate template
    let template = '';
    if (currentUser.role === 'ROOT_User') {
      template = `<a>${APP_URL}/${currentUser._id}/active-account?token=${activationToken}</a>`;
    } else {
      // If user is sub User then generate new temporary password
      let tempPassword = '';
      // Create temporary password
      tempPassword = generator.generate({ numbers: true });
      //   Hash password

      currentUser.password = await bcrypt.hash(tempPassword, 10);
      await currentUser.save();

      template = `<a>${APP_URL}/${currentUser._id}/active-account?token=${activationToken}</a> <br/> Your temporary password is: ${tempPassword}`;
    }

    // Send new activation token to user email after saving user data and response back to the user
    await mailSender({
      email: currentUser.email,
      subject: 'Active your account',
      template
    });

    return next(
      createError(
        406,
        `Your account isn't activated yet.A new activation link send to your email.Please verify your email`
      )
    );
  }

  // If user password don't matched with the given password
  if (!(await bcrypt.compare(password, currentUser.hashPassword)))
    return next(createError(401, "Email or password doesn't match"));

  // Create access token
  const accessToken = await generateAccessToken(currentUser);

  res.cookie('x-access-token', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production' // Use HTTPS always
  });

  return res.status(200).json({
    message: 'Login successful'
  });
};

/* ============================================================================================
============================================ Forgot Password====================================
=============================================================================================== */

exports.forgotPassword = async (req, res) => {
  const { currentUser } = req.locals;

  const passwordResetToken = await tokenGenerator({ _id: currentUser._id });

  const template = `<a href="${APP_URL}/User/reset-password?token=${passwordResetToken}">Reset your password</a>`;

  await mailSender({
    email: currentUser.email,
    subject: 'Reset your password',
    template
  });

  return res
    .status('200')
    .json({ message: 'Password reset link has been sent to you email' });
};

/* ============================================================================================
============================================ Reset Password ====================================
=============================================================================================== */

exports.resetPassword = async (req, res, next) => {
  const { token } = req.query;
  const { password } = req.locals.validateValue;

  // Verify the activation token
  const { isInvalid, isExpired, decoded } = verifyToken(token, JWT_SECRET_KEY);

  // If token is invalid
  if (isInvalid) return next(createError(406, 'Invalid password reset link'));

  // If token is expired then create new token and send it to the user email
  if (isExpired) return next(createError(406, 'Password reset link expired'));

  // If object id isn't valid
  if (!validateObjectId(decoded._id)) {
    return next(createError(406, 'Invalid ID'));
  }

  const currentUser = await User.findById(decoded._id);

  // If user not found
  if (!currentUser) return next(createError(404, 'User not found'));

  // If all thing goes is Ok then reset the user password

  currentUser.hashPassword = await bcrypt.hash(password, 10);
  await currentUser.save();

  // Send mail to the user
  const template = 'Password reset successfully';
  mailSender({
    email: currentUser.email,
    subject: 'Password reset successfully',
    template
  });

  // Response to the user
  return res.status(200).json({
    message: 'Password reset successfully'
  });
};

/* ======================================================================================
===================================== Change password =====================================
========================================================================================= */
exports.changePassword = async (req, res, next) => {
  const {
    currentUser,
    validateValue: { currentPassword, newPassword }
  } = req.locals;

  // If user password don't matched with the given password
  if (!(await bcrypt.compare(currentPassword, currentUser.hashPassword)))
    return next(createError(406, 'Invalid current password'));

  //   Hash password and insert it into the user model

  const hash = await bcrypt.hash(newPassword, 10);
  currentUser.hashPassword = hash;

  await currentUser.save();

  // Send mail to the user
  const template = 'Password change successfully';
  mailSender({
    email: currentUser.email,
    subject: 'Password change successfully',
    template
  });

  return res.status(200).json({ message: 'Password change successfully' });
};

/* ======================================================================================
/* =============================== Get all Users ===========================================
/* ====================================================================================== */
exports.getAllUsers = async (req, res) => {
  const allUsers = await User.find({
    role: { $ne: 'ROOT_User' }
  }).select('profile role');

  return res.status(200).json(allUsers);
};

/* ======================================================================================
/* ===============================  Edit profile ===========================================
/* ====================================================================================== */
exports.editProfile = async (req, res) => {
  const { currentUser, validateValue } = req.locals;

  currentUser.profile = validateValue;

  await currentUser.save();
  return res.status(200).json({ message: 'Profile update successfully' });
};

/* ======================================================================================
===================================== Logout =============================================
========================================================================================= */
exports.logout = async (req, res) => {
  res.clearCookie('x-access-token');

  return res.status(200).json({ message: 'Logout successfully' });
};
