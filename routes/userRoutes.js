const router = require('express').Router();
const {
  createUser,
  resendActivationLink,
  activeAccount,
  login,
  forgotPassword,
  resetPassword,
  changePassword,
  editProfile,
  logout
} = require('../controllers/userController');

const {
  RegistrationValidator
} = require('../validators/registrationValidators');
const loginValidator = require('../validators/loginValidator');
const forgotPasswordValidator = require('../validators/forgotPasswordValidator');
const resetPasswordValidator = require('../validators/resetPasswordValidator');
const changePasswordValidator = require('../validators/changePasswordValidator');
const profileValidator = require('../validators/profileValidator');

const validate = require('../middleware/validate');
const findUser = require('../middleware/findUser');
const authentication = require('../middleware/authentication');

router
  .post('/create-user', validate(RegistrationValidator), createUser)
  .get('/resend-activation-link/:userId', findUser, resendActivationLink)
  .get('/active-account', activeAccount)
  .post('/login', validate(loginValidator), findUser, login)
  .post(
    '/forgot-password',
    validate(forgotPasswordValidator),
    findUser,
    forgotPassword
  )
  .post('/reset-password', validate(resetPasswordValidator), resetPassword)
  .put(
    '/change-password',
    validate(changePasswordValidator),
    authentication,
    findUser,
    changePassword
  )
  .put(
    '/edit-profile',
    validate(profileValidator),
    authentication,
    findUser,
    editProfile
  )
  .post('/logout', logout);

module.exports = router;
