const _ = require('lodash');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Admin = require('../models/Admin');
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
} = require('./adminController');
const tokenGenerator = require('../utils/tokenGenerator');
const generateAccessToken = require('../utils/generateAccessToken');
const verifyToken = require('../utils/verifyToken');
const validateObjectId = require('../utils/validateObjectId');
const mailSender = require('../mailer/mailSender');

const mockSave = jest.fn(() => Promise.resolve(true));

jest.mock('../models/Admin', () => {
  return jest.fn().mockImplementation(value => {
    return { ...value, save: mockSave };
  });
});

jest.mock('../utils/tokenGenerator', () => {
  return jest
    .fn()
    .mockImplementation(() =>
      Promise.resolve(
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
      )
    );
});

jest.mock('../mailer/mailSender', () => {
  return jest.fn().mockImplementation(() => Promise.resolve(true));
});
jest.mock('../utils/generateAccessToken', () => {
  return jest
    .fn()
    .mockImplementation(() =>
      Promise.resolve(
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
      )
    );
});

jest.mock('../utils/verifyToken', () => {
  return jest.fn();
});

jest.mock('../utils/validateObjectId', () => {
  return jest.fn();
});

const decode = jest.spyOn(jwt, 'decode');

const bcryptCompare = jest.spyOn(bcrypt, 'compare');

describe('Admin controllers', () => {
  beforeEach(() => {
    // Clear all instances and calls to constructor and all methods:
    Admin.mockClear();
    mockSave.mockClear();
    tokenGenerator.mockClear();
    mailSender.mockClear();
    verifyToken.mockClear();
    decode.mockClear();
    bcryptCompare.mockClear();
    validateObjectId.mockClear();
  });

  // ==================================================================================================
  // ===================================== Create Root admin ==========================================
  // ==================================================================================================

  describe('createRootAdmin', () => {
    const req = {};
    _.set(req, 'locals.validateValue', {
      firstName: 'Shifut',
      lastName: 'Hossain',
      email: 'mdshifut@gmail.com',
      password: 'password2134'
    });

    it('should response and redirect with status code 301 if root admin already exist.', async () => {
      expect.hasAssertions();

      Admin.findOne = jest.fn().mockResolvedValueOnce(true);

      const res = {
        redirect: jest.fn(() => res)
      };
      await createRootAdmin(req, res);

      expect(Admin.findOne).toHaveBeenCalledWith({ role: 'ROOT_ADMIN' });
      expect(Admin.findOne).toHaveBeenCalledTimes(1);

      expect(res.redirect).toHaveBeenCalledTimes(1);
      expect(res.redirect).toHaveBeenCalledWith('/admin/login');
    });

    it('should response with status code 406 if email already exist.', async () => {
      expect.hasAssertions();

      Admin.findOne = jest
        .fn()
        .mockResolvedValueOnce(false)
        .mockResolvedValueOnce(true);

      const next = jest.fn();
      await createRootAdmin(req, {}, next);

      expect(Admin.findOne).toHaveBeenNthCalledWith(2, {
        email: 'mdshifut@gmail.com'
      });
      expect(Admin.findOne).toHaveBeenCalledTimes(2);

      expect(next.mock.calls[0][0]).toHaveProperty('statusCode', 406);
      expect(next).toHaveBeenCalledTimes(1);
    });

    it('should response with status code 201 if all data is valid', async () => {
      expect.hasAssertions();

      Admin.findOne = jest
        .fn()
        .mockResolvedValueOnce(false)
        .mockResolvedValueOnce(false);

      const res = {
        status: jest.fn(() => res),
        json: jest.fn(() => res)
      };

      await createRootAdmin(req, res);

      expect(Admin.findOne).toHaveBeenCalledTimes(2);

      expect(Admin).toHaveBeenCalledTimes(1);

      expect(tokenGenerator).toHaveBeenCalledTimes(1);

      expect(mockSave).toHaveBeenCalledTimes(1);

      expect(mailSender).toHaveBeenCalledTimes(1);
      expect(mailSender.mock.calls[0][0]).toHaveProperty('subject');

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.status).toHaveBeenCalledTimes(1);

      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.json.mock.calls[0][0]).toHaveProperty('message');
    });
  });

  // ==================================================================================================
  // ===================================== Create  admin ==========================================
  // ==================================================================================================

  describe('createAdmin', () => {
    const req = {};
    _.set(req, 'locals.validateValue', {
      firstName: 'Shifut',
      lastName: 'Hossain',
      email: 'mdshifut@gmail.com',
      role: 'manager'
    });

    it('should response with status code 406 if email already exist.', async () => {
      expect.hasAssertions();

      Admin.findOne = jest.fn().mockResolvedValueOnce(true);

      const next = jest.fn();
      await createAdmin(req, {}, next);

      expect(Admin.findOne).toHaveBeenNthCalledWith(1, {
        email: 'mdshifut@gmail.com'
      });

      expect(Admin.findOne).toHaveBeenCalledTimes(1);

      expect(next.mock.calls[0][0]).toHaveProperty('statusCode', 406);
      expect(next).toHaveBeenCalledTimes(1);
    });

    it('should response with status code 201 if all data is valid', async () => {
      expect.hasAssertions();

      Admin.findOne = jest.fn().mockResolvedValueOnce(false);

      const res = {
        status: jest.fn(() => res),
        json: jest.fn(() => res)
      };

      await createAdmin(req, res);

      expect(Admin.findOne).toHaveBeenCalledTimes(1);

      expect(Admin).toHaveBeenCalledTimes(1);

      expect(tokenGenerator).toHaveBeenCalledTimes(1);

      expect(mockSave).toHaveBeenCalledTimes(1);

      expect(mailSender).toHaveBeenCalledTimes(1);
      expect(mailSender.mock.calls[0][0]).toHaveProperty('subject');

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.status).toHaveBeenCalledTimes(1);

      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.json.mock.calls[0][0]).toHaveProperty('message');
    });
  });

  // ==================================================================================================
  // ===================================== Resend activation ==========================================
  // ==================================================================================================

  describe('resendActivationLink', () => {
    const req = {};
    _.set(req, 'locals.currentUser', {
      profile: { firstName: 'Shifut', lastName: 'Hossain' },
      email: 'mdshifut@gmail.com',
      role: 'manager',
      isActivated: false,
      _id: '507f1f77bcf86cd799439011'
    });

    it('should response with status code 400 if user already activate', async () => {
      expect.hasAssertions();

      _.set(req, 'locals.currentUser.isActivated', true);

      const next = jest.fn();
      await resendActivationLink(req, {}, next);

      expect(next).toHaveBeenCalledTimes(1);
    });

    it('should  send email then response with status code 201', async () => {
      expect.hasAssertions();

      _.set(req, 'locals.currentUser.isActivated', false);
      _.set(req, 'locals.currentUser.role', 'ROOT_ADMIN');

      const res = {
        status: jest.fn(() => res),
        json: jest.fn(() => res)
      };

      await resendActivationLink(req, res);

      expect(tokenGenerator).toHaveBeenCalledTimes(1);

      expect(mailSender).toHaveBeenCalledTimes(1);

      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledTimes(1);
    });

    it('should create temp password and send email then response with status code 201', async () => {
      expect.hasAssertions();

      _.set(req, 'locals.currentUser.isActivated', false);
      _.set(req, 'locals.currentUser.role', 'MANAGER');
      _.set(req, 'locals.currentUser.save', mockSave);

      const res = {
        status: jest.fn(() => res),
        json: jest.fn(() => res)
      };

      await resendActivationLink(req, res);

      expect(tokenGenerator).toHaveBeenCalledTimes(1);
      expect(mockSave).toHaveBeenCalledTimes(1);

      expect(mailSender).toHaveBeenCalledTimes(1);

      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledTimes(1);
    });
  });
  // ==================================================================================================
  // ===================================== Active account ==========================================
  // ==================================================================================================

  describe('activeAccount', () => {
    const req = {};
    _.set(req, 'query.token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9');

    it('should  send error response if token is invalid', async () => {
      expect.hasAssertions();

      verifyToken.mockReturnValue({ isInvalid: true });
      const next = jest.fn();
      await activeAccount(req, {}, next);

      expect(verifyToken).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledTimes(1);
    });

    it("should decode and send error response if id isn't valid mongoose id", async () => {
      expect.hasAssertions();

      verifyToken.mockReturnValue({
        decoded: { _id: '5df091c24f2d7f62ab424692' }
      });
      validateObjectId.mockReturnValue(false);

      const next = jest.fn();
      await activeAccount(req, {}, next);

      expect(verifyToken).toHaveBeenCalledTimes(1);
      expect(validateObjectId).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledTimes(1);
    });

    it('should decode and send error response if user not found', async () => {
      expect.hasAssertions();

      verifyToken.mockReturnValue({
        decoded: { _id: '5df091c24f2d7f62ab424692' }
      });

      validateObjectId.mockReturnValue(true);
      Admin.findById = jest.fn().mockResolvedValueOnce(null);
      const next = jest.fn();
      await activeAccount(req, {}, next);

      expect(verifyToken).toHaveBeenCalledTimes(1);
      expect(validateObjectId).toHaveBeenCalledTimes(1);
      expect(Admin.findById).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledTimes(1);
    });

    it('should decode and send error response if account is already activated', async () => {
      expect.hasAssertions();

      verifyToken.mockReturnValue({
        decoded: { _id: '5df091c24f2d7f62ab424692' }
      });

      validateObjectId.mockReturnValue(true);
      Admin.findById = jest.fn().mockResolvedValueOnce({ isActivated: true });
      const next = jest.fn();
      await activeAccount(req, {}, next);

      expect(verifyToken).toHaveBeenCalledTimes(1);
      expect(validateObjectId).toHaveBeenCalledTimes(1);
      expect(Admin.findById).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledTimes(1);
    });

    it('should decode and send error response if token is expired', async () => {
      expect.hasAssertions();

      verifyToken.mockReturnValue({
        isExpired: true,
        decoded: { _id: '5df091c24f2d7f62ab424692' }
      });

      validateObjectId.mockReturnValue(true);
      Admin.findById = jest.fn().mockResolvedValueOnce({
        isActivated: false,
        _id: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
        role: 'ROOT_ADMIN'
      });
      const next = jest.fn();
      await activeAccount(req, {}, next);

      expect(verifyToken).toHaveBeenCalledTimes(1);
      expect(validateObjectId).toHaveBeenCalledTimes(1);
      expect(Admin.findById).toHaveBeenCalledTimes(1);
      expect(tokenGenerator).toHaveBeenCalledTimes(1);
      expect(mailSender).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledTimes(1);
    });

    it('should decode and generate temp password and send error response if token is expired and the admin is not a root admin', async () => {
      expect.hasAssertions();

      verifyToken.mockReturnValue({
        isExpired: true,
        decoded: { _id: '5df091c24f2d7f62ab424692' }
      });

      validateObjectId.mockReturnValue(true);
      Admin.findById = jest.fn().mockResolvedValueOnce({
        isActivated: false,
        _id: '5df091c24f2d7f62ab424692',
        role: 'MANAGER',
        save: mockSave
      });
      const next = jest.fn();
      await activeAccount(req, {}, next);

      expect(verifyToken).toHaveBeenCalledTimes(1);
      expect(validateObjectId).toHaveBeenCalledTimes(1);
      expect(Admin.findById).toHaveBeenCalledTimes(1);
      expect(tokenGenerator).toHaveBeenCalledTimes(1);
      expect(mockSave).toHaveBeenCalledTimes(1);
      expect(mailSender).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledTimes(1);
    });

    it('should response successful message if account is activate successfully', async () => {
      expect.hasAssertions();

      verifyToken.mockReturnValue({
        decoded: { _id: '5df091c24f2d7f62ab424692' }
      });

      validateObjectId.mockReturnValue(true);
      Admin.findById = jest.fn().mockResolvedValueOnce({
        isActivated: false,
        _id: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
        role: 'MANAGER',
        save: mockSave
      });

      const res = {
        status: jest.fn(() => res),
        json: jest.fn(() => res)
      };

      await activeAccount(req, res);

      expect(verifyToken).toHaveBeenCalledTimes(1);
      expect(validateObjectId).toHaveBeenCalledTimes(1);
      expect(Admin.findById).toHaveBeenCalledTimes(1);
      expect(mockSave).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledTimes(1);
    });
  });
  // ==================================================================================================
  // ===================================== login ==========================================
  // ==================================================================================================
  describe('login', () => {
    const req = {};
    _.set(req, 'locals.validateValue.password', 'validatePassword');

    _.set(req, 'locals.currentUser', { _id: '4edd40c86762e0fb12000003' });

    it('should  send error response if admin is disabled', async () => {
      expect.hasAssertions();
      _.set(req, 'locals.currentUser.isDisable', true);

      const next = jest.fn();
      await login(req, {}, next);

      expect(next).toHaveBeenCalledTimes(1);
    });

    it('should  send error response if account is not activate', async () => {
      expect.hasAssertions();
      _.set(req, 'locals.currentUser.isDisable', false);
      _.set(req, 'locals.currentUser.isActivated', false);
      _.set(req, 'locals.currentUser.role', 'ROOT_ADMIN');
      _.set(req, 'locals.currentUser.save', mockSave);

      const next = jest.fn();
      await login(req, {}, next);

      expect(tokenGenerator).toHaveBeenCalledTimes(1);
      expect(mailSender).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledTimes(1);
    });

    it('should  send error response and generate new password for not root admins if account is not activate', async () => {
      expect.hasAssertions();
      _.set(req, 'locals.currentUser.isDisable', false);
      _.set(req, 'locals.currentUser.isActivated', false);
      _.set(req, 'locals.currentUser.role', 'MANAGER');
      _.set(req, 'locals.currentUser.save', mockSave);

      const next = jest.fn();
      await login(req, {}, next);

      expect(tokenGenerator).toHaveBeenCalledTimes(1);
      expect(mockSave).toHaveBeenCalledTimes(1);
      expect(mailSender).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledTimes(1);
    });

    it('should  send error response password does not match', async () => {
      expect.hasAssertions();
      _.set(req, 'locals.currentUser.isDisable', false);
      _.set(req, 'locals.currentUser.isActivated', true);

      bcryptCompare.mockResolvedValueOnce(false);
      const next = jest.fn();
      await login(req, {}, next);

      expect(bcryptCompare).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledTimes(1);
    });

    it('should  send login successful with cookie', async () => {
      expect.hasAssertions();
      _.set(req, 'locals.currentUser', {
        isActivated: true,
        isDisable: false,
        email: 'mdshifut@gmail.com',
        profile: { firstName: 'Shifut', lastName: 'Hossain' }
      });

      bcryptCompare.mockResolvedValueOnce(true);

      const res = {
        status: jest.fn(() => res),
        json: jest.fn(() => res),
        cookie: jest.fn(() => res)
      };
      await login(req, res);

      expect(bcryptCompare).toHaveBeenCalledTimes(1);
      expect(generateAccessToken).toHaveBeenCalledTimes(1);
      expect(res.cookie).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledTimes(1);
    });
  });
  // ==================================================================================================
  // ===================================== forgotPassword ==========================================
  // ==================================================================================================
  describe('forgotPassword', () => {
    const req = {};

    _.set(req, 'locals.currentUser', { _id: '4edd40c86762e0fb12000003' });

    it('should  send password reset token', async () => {
      expect.hasAssertions();

      const res = {
        status: jest.fn(() => res),
        json: jest.fn(() => res)
      };
      await forgotPassword(req, res);

      expect(tokenGenerator).toHaveBeenCalledTimes(1);
      expect(mailSender).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledTimes(1);
    });
  });
  // ===================================== Reset Password ==========================================
  // ==================================================================================================
  describe('resetPassword', () => {
    const req = {};

    _.set(req, 'locals.validateValue.password', 'ValidatePassword');
    _.set(
      req,
      'query.token',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
    );

    it('should response with status code 401 if password reset token is invalid', async () => {
      expect.hasAssertions();

      verifyToken.mockReturnValue({ isInvalid: true });
      const next = jest.fn();
      await resetPassword(req, {}, next);

      expect(verifyToken).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledTimes(1);
    });

    it('should decode and send error response if token is expired', async () => {
      expect.hasAssertions();

      verifyToken.mockReturnValue({ isExpired: true });

      const next = jest.fn();
      await resetPassword(req, {}, next);

      expect(verifyToken).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledTimes(1);
    });

    it('should decode and send error response if id is not valid', async () => {
      expect.hasAssertions();

      verifyToken.mockReturnValue({
        decoded: { _id: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9' }
      });
      validateObjectId.mockReturnValue(false);
      const next = jest.fn();
      await resetPassword(req, {}, next);

      expect(verifyToken).toHaveBeenCalledTimes(1);
      expect(validateObjectId).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledTimes(1);
    });

    it('should decode and send error response if user not found', async () => {
      expect.hasAssertions();

      verifyToken.mockReturnValue({
        decoded: { _id: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9' }
      });

      validateObjectId.mockReturnValue(true);
      Admin.findById = jest.fn().mockResolvedValueOnce(null);
      const next = jest.fn();
      await resetPassword(req, {}, next);

      expect(verifyToken).toHaveBeenCalledTimes(1);
      expect(validateObjectId).toHaveBeenCalledTimes(1);
      expect(Admin.findById).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledTimes(1);
    });

    it('should reset and send successful response if all data is valid', async () => {
      expect.hasAssertions();

      verifyToken.mockReturnValue({
        decoded: { _id: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9' }
      });

      Admin.findById = jest.fn().mockResolvedValueOnce({
        isActivated: false,
        _id: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
        role: 'ROOT_ADMIN',
        save: mockSave
      });
      const res = {
        status: jest.fn(() => res),
        json: jest.fn(() => res)
      };
      await resetPassword(req, res);

      expect(verifyToken).toHaveBeenCalledTimes(1);
      expect(Admin.findById).toHaveBeenCalledTimes(1);
      expect(mockSave).toHaveBeenCalledTimes(1);
      expect(mailSender).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledTimes(1);
    });
  });

  // ===================================== Change password  ==========================================
  // ==================================================================================================
  describe('changePassword', () => {
    const req = {};

    _.set(req, 'locals.validateValue', {
      currentPassword: 'currentPassword',
      newPassword: 'newPassword'
    });
    _.set(req, 'locals.currentUser', {
      hashPassword: 'hasValue'
    });

    it('should response with status code 401 if current password and new password does not match', async () => {
      expect.hasAssertions();

      bcryptCompare.mockResolvedValueOnce(false);
      const next = jest.fn();
      await changePassword(req, {}, next);

      expect(bcryptCompare).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledTimes(1);
    });

    it('should reset and send successful response if all data is valid', async () => {
      expect.hasAssertions();

      _.set(req, 'locals.currentUser.save', mockSave);

      bcryptCompare.mockResolvedValueOnce(true);
      const res = {
        status: jest.fn(() => res),
        json: jest.fn(() => res)
      };
      await changePassword(req, res);

      expect(bcryptCompare).toHaveBeenCalledTimes(1);
      expect(mockSave).toHaveBeenCalledTimes(1);
      expect(mailSender).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledTimes(1);
    });
  });

  // ===================================== logout ==========================================
  // ==================================================================================================
  describe('logout', () => {
    it('should logout the user', async () => {
      expect.hasAssertions();
      const res = {
        status: jest.fn(() => res),
        json: jest.fn(() => res),
        clearCookie: jest.fn(() => res)
      };

      await logout({}, res);

      expect(res.clearCookie).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledTimes(1);
    });
  });

  // ===================================== Get all admins  ==========================================
  // ==================================================================================================
  describe('getAllAdmins', () => {
    it('should return all admins', async () => {
      expect.hasAssertions();
      const res = {
        status: jest.fn(() => res),
        json: jest.fn(() => res)
      };

      Admin.find = jest.fn().mockImplementationOnce(() => ({
        select: jest.fn().mockResolvedValueOnce([])
      }));

      await getAllAdmins({}, res);

      expect(Admin.find).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledTimes(1);
    });
  });

  // ===================================== Change sub admin rules   ==========================================
  // ==================================================================================================
  describe('changeRole', () => {
    it('should change the role and response', async () => {
      expect.hasAssertions();
      const req = {};
      _.set(req, 'locals.validateValue.role', 'MANAGER');
      _.set(req, 'locals.currentUser.save', mockSave);

      const res = {
        status: jest.fn(() => res),
        json: jest.fn(() => res)
      };

      await changeRole(req, res);

      expect(req.locals.currentUser.role).toStrictEqual('MANAGER');
      expect(mockSave).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledTimes(1);
    });
  });

  // ===================================== Disable sub admin    ==========================================
  // ==================================================================================================
  describe('disableAdmin', () => {
    it('should disable an admin and response', async () => {
      expect.hasAssertions();
      const req = {};
      _.set(req, 'locals.currentUser.save', mockSave);

      const res = {
        status: jest.fn(() => res),
        json: jest.fn(() => res)
      };

      await disableAdmin(req, res);

      expect(req.locals.currentUser.isDisable).toStrictEqual(true);
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledTimes(1);
    });
  });

  // ===================================== Enable sub admin     ==========================================
  // ==================================================================================================
  describe('enableAdmin', () => {
    it('should enable an admin and response', async () => {
      expect.hasAssertions();
      const req = {};
      _.set(req, 'locals.currentUser.save', mockSave);

      const res = {
        status: jest.fn(() => res),
        json: jest.fn(() => res)
      };

      await enableAdmin(req, res);

      expect(req.locals.currentUser.isDisable).toStrictEqual(false);
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledTimes(1);
    });
  });

  // ===================================== changeSettings     ==========================================
  // ==================================================================================================
  describe('changeSettings', () => {
    it('should update settings', async () => {
      expect.hasAssertions();
      const req = {};
      _.set(req, 'locals', {
        currentUser: { save: mockSave },
        validateValue: { settings: { reservationEmailNotification: true } }
      });

      const res = {
        status: jest.fn(() => res),
        json: jest.fn(() => res)
      };

      await changeSettings(req, res);

      expect(mockSave).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledTimes(1);
    });
  });

  // ===================================== edit profile     ==========================================
  // ==================================================================================================
  describe('editProfile', () => {
    it('should update profile', async () => {
      expect.hasAssertions();
      const req = {};
      _.set(req, 'locals', {
        currentUser: { save: mockSave },
        validateValue: {
          profile: {
            firstName: 'Shifut',
            lastName: 'Hossain'
          }
        }
      });

      const res = {
        status: jest.fn(() => res),
        json: jest.fn(() => res)
      };

      await editProfile(req, res);

      expect(mockSave).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledTimes(1);
    });
  });
  // ===================================== Remove an admin/ delete and admin      ==========================================
  // ==================================================================================================
  describe('removeAdmin', () => {
    it('should return 400 if the admin is a Root admin', async () => {
      expect.hasAssertions();
      const req = {};
      _.set(req, 'locals', {
        currentUser: { role: 'ROOT_ADMIN' }
      });

      const next = jest.fn();
      await removeAdmin(req, {}, next);

      expect(next).toHaveBeenCalledTimes(1);
    });
    it('should return 200 and remove the admin', async () => {
      expect.hasAssertions();
      const req = {};
      const remove = jest.fn().mockResolvedValueOnce();
      _.set(req, 'locals', {
        currentUser: {
          role: 'MANAGER',
          remove
        }
      });

      const res = {
        status: jest.fn(() => res),
        json: jest.fn(() => res)
      };

      await removeAdmin(req, res, {});

      expect(remove).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledTimes(1);
    });
  });
});
