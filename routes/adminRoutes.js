const router = require('express').Router();
const {
  createRootAdmin,
  createAdmin,
  resendActivationLink,
  activeAccount,
  login,
  forgotPassword,
  resetPassword,
  changePassword,
  logout,
  getAllAdmins,
  changeRole,
  disableAdmin,
  enableAdmin,
  changeSettings,
  editProfile,
  removeAdmin
} = require('../controllers/adminController');

const {
  RegistrationValidator,
  createAdminValidator
} = require('../validators/registrationValidators');
const loginValidator = require('../validators/loginValidator');
const forgotPasswordValidator = require('../validators/forgotPasswordValidator');
const resetPasswordValidator = require('../validators/resetPasswordValidator');
const changePasswordValidator = require('../validators/changePasswordValidator');
const roleValidator = require('../validators/roleValidator');
const settingsValidator = require('../validators/settingsValidator');
const profileValidator = require('../validators/profileValidator');

const validate = require('../middleware/validate');
const adminPermission = require('../middleware/adminPermission');
const findAdmin = require('../middleware/findAdmin');
const authentication = require('../middleware/authentication');

router
  .post('/create-root-admin', validate(RegistrationValidator), createRootAdmin)
  .post(
    '/create-admin',
    authentication,
    adminPermission('ROOT_ADMIN'),
    validate(createAdminValidator),
    createAdmin
  )
  .get('/resend-activation-link/:adminId', findAdmin, resendActivationLink)
  .get('/active-account', activeAccount)
  .post('/login', validate(loginValidator), findAdmin, login)
  .post(
    '/forgot-password',
    validate(forgotPasswordValidator),
    findAdmin,
    forgotPassword
  )
  .post('/reset-password', validate(resetPasswordValidator), resetPassword)
  .put(
    '/change-password',
    validate(changePasswordValidator),
    authentication,
    findAdmin,
    changePassword
  )

  .get(
    '/get-admins',
    authentication,
    adminPermission('ROOT_ADMIN'),
    getAllAdmins
  )
  .put(
    '/change-role/:adminId',
    validate(roleValidator),
    authentication,
    adminPermission('ROOT_ADMIN'),
    findAdmin,
    changeRole
  )
  .put(
    '/disable-admin/:adminId',
    authentication,
    adminPermission('ROOT_ADMIN'),
    findAdmin,
    disableAdmin
  )
  .put(
    '/enable-admin/:adminId',
    authentication,
    adminPermission('ROOT_ADMIN'),
    findAdmin,
    enableAdmin
  )
  .put(
    '/change-settings',
    validate(settingsValidator),
    authentication,
    findAdmin,
    changeSettings
  )
  .put(
    '/edit-profile',
    validate(profileValidator),
    authentication,
    findAdmin,
    editProfile
  )
  .delete(
    '/delete-admin/:adminId',
    authentication,
    adminPermission('ROOT_ADMIN'),
    findAdmin,
    removeAdmin
  )
  .post('/logout', logout);

module.exports = router;
