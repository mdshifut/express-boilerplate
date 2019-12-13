// const _ = require('lodash');
// const bcrypt = require('bcrypt');
// const cookie = require('cookie');
// const request = require('supertest');
// const User = require('../models/User');
// const mailSender = require('../mailer/mailSender');
// const generateAccessToken = require('../utils/generateAccessToken');
// const tokenGenerator = require('../utils/tokenGenerator');

// let server;

// const validData = {
//   firstName: 'Shifut',
//   lastName: 'Hossain',
//   email: 'mdshifut@gmail.com',
//   password: 'password2134',
//   confirmPassword: 'password2134'
// };

// const dataBaseData = {
//   settings: { reservationEmailNotification: true },
//   isActivated: false,
//   profile: { firstName: 'Shifut', lastName: 'Hossain' },
//   email: 'mdshifut@gmail.com',
//   hashPassword: '$2b$10$NjKIMq4gpl69yfbi2eMTWOzPG.DISBRUXe34LHI04yjQ1bhwg5s5u'
// };

// jest.mock('../mailer/mailSender', () => {
//   return jest.fn().mockImplementation(() => Promise.resolve(true));
// });

// describe('/api/admin', () => {
//   beforeEach(async () => {
//     // Clear all instances and calls to constructor and all methods:
//     mailSender.mockRestore();
//     // eslint-disable-next-line global-require
//     server = require('../server');
//     await User.deleteMany({});
//   });

//   afterEach(async () => {
//     await server.close();
//   });

//   // ==================================================================
//   // ======================= Create root admin ========================
//   // ===============================================================
//   describe('POST /create-user', () => {
//     const exec = value => {
//       return request(server)
//         .post('/api/user/create-user')
//         .send(value);
//     };

//     it('should return 406 if value is not valid', async () => {
//       expect.assertions(2);

//       const { status, body } = await exec({});

//       expect(status).toBe(406);
//       expect(body).toHaveProperty('error.message');
//     });

//     it('should response with 406 if email already exist', async () => {
//       expect.assertions(2);

//       await User.create(validData);

//       const { status, body } = await exec(validData);

//       expect(status).toBe(406);
//       expect(body).toHaveProperty('error.message', 'Email already exist');
//     });

//     it('should response with 201 if all data is valid', async () => {
//       expect.hasAssertions();

//       const { status, body } = await exec(validData);

//       expect(status).toBe(201);

//       expect(mailSender.mock.calls[0][0]).toHaveProperty(
//         'subject',
//         'Active your account'
//       );
//       expect(mailSender.mock.calls[0][0]).toHaveProperty(
//         'email',
//         validData.email
//       );

//       expect(body).toHaveProperty(
//         'message',
//         'Account created successfully. Please verify your email'
//       );
//     });
//   });

//   // ==================================================================
//   // ======================= Resend activation link ========================
//   // ===============================================================
//   // describe('GET /resend-activation-link/:adminId', () => {
//   //   const exec = id => {
//   //     return request(server).get(`/api/admin/resend-activation-link/${id}`);
//   //   };

//   //   it('should return 404 if user is not found', async () => {
//   //     expect.assertions(2);

//   //     const { status, body } = await exec('4edd40c86762e0fb12000003');

//   //     expect(status).toBe(404);
//   //     expect(body).toHaveProperty('error.message', 'User not found');
//   //   });

//   //   it('should return 406 if user already activated', async () => {
//   //     expect.assertions(2);

//   //     const admin = await User.create({
//   //       ...dataBaseData,
//   //       isActivated: true
//   //     });
//   //     const { status, body } = await exec(User._id);

//   //     expect(status).toBe(406);
//   //     expect(body).toHaveProperty(
//   //       'error.message',
//   //       'Account already activated. Please login with Email and Password'
//   //     );
//   //   });

//   //   it("should return 200 and send new activation email if user isn't activated", async () => {
//   //     expect.assertions(4);

//   //     const admin = await User.create(dataBaseData);
//   //     const { status, body } = await exec(User._id);

//   //     expect(status).toBe(200);
//   //     expect(body).toHaveProperty(
//   //       'message',
//   //       'A new activation link has been sent to your email'
//   //     );

//   //     expect(mailSender.mock.calls[0][0]).toHaveProperty(
//   //       'subject',
//   //       'Active your account'
//   //     );
//   //     expect(mailSender.mock.calls[0][0]).toHaveProperty(
//   //       'email',
//   //       validData.email
//   //     );
//   //   });
//   // });
//   // // ================================================================
//   // // ======================= Active account ========================
//   // // ===============================================================
//   // describe('GET /active-account', () => {
//   //   const exec = token => {
//   //     return request(server).get(`/api/admin/active-account?token=${token}`);
//   //   };

//   //   it('should return 406 if token is invalid', async () => {
//   //     expect.assertions(2);

//   //     const { status, body } = await exec('4edd40c86762e0fb12000003');

//   //     expect(status).toBe(406);
//   //     expect(body).toHaveProperty('error.message', 'Invalid activation token');
//   //   });

//   //   it('should return 406 if token is expired', async () => {
//   //     expect.assertions(4);

//   //     const admin = await User.create(dataBaseData);
//   //     const token = await tokenGenerator({
//   //       _id: User._id,
//   //       valid: '0.1ms'
//   //     });

//   //     const { status, body } = await exec(token);

//   //     expect(mailSender.mock.calls[0][0]).toHaveProperty(
//   //       'subject',
//   //       'Active your account'
//   //     );

//   //     expect(mailSender.mock.calls[0][0]).toHaveProperty(
//   //       'email',
//   //       validData.email
//   //     );

//   //     expect(status).toBe(406);
//   //     expect(body).toHaveProperty(
//   //       'error.message',
//   //       'Activation link expired. A new activation link has been sent to your email'
//   //     );
//   //   });
//   //   it("should return 406 if user id isn't valid", async () => {
//   //     expect.assertions(2);

//   //     const token = await tokenGenerator({
//   //       _id: '5df091c24f2d7f6sf2ab4sf24692'
//   //     });

//   //     const { status, body } = await exec(token);

//   //     expect(status).toBe(406);
//   //     expect(body).toHaveProperty('error.message', 'Invalid ID');
//   //   });

//   //   it('should return 404 if user not found', async () => {
//   //     expect.assertions(2);

//   //     const token = await tokenGenerator({
//   //       _id: '5df091c24f2d7f62ab424692'
//   //     });

//   //     const { status, body } = await exec(token);

//   //     expect(status).toBe(404);
//   //     expect(body).toHaveProperty('error.message', 'User not found');
//   //   });

//   //   it('should return 400 if account already activated', async () => {
//   //     expect.assertions(2);

//   //     const admin = await User.create({ ...dataBaseData, isActivated: true });
//   //     const token = await tokenGenerator({
//   //       _id: User._id
//   //     });

//   //     const { status, body } = await exec(token);

//   //     expect(status).toBe(400);
//   //     expect(body).toHaveProperty(
//   //       'error.message',
//   //       'Account already activated. Please login with your  Email and Password'
//   //     );
//   //   });

//   //   it('should return 200 if  account successfully activated', async () => {
//   //     expect.assertions(2);

//   //     const admin = await User.create(dataBaseData);
//   //     const token = await tokenGenerator({
//   //       _id: User._id
//   //     });

//   //     const { status, body } = await exec(token);

//   //     expect(status).toBe(200);
//   //     expect(body).toHaveProperty(
//   //       'message',
//   //       'Account activated successfully. Now you can login with your Email and Password'
//   //     );
//   //   });
//   // });
//   // // ================================================================
//   // // ======================= login ========================
//   // // ===============================================================
//   // describe('POST /login', () => {
//   //   const exec = value => {
//   //     return request(server)
//   //       .post(`/api/admin/login`)
//   //       .send(value);
//   //   };

//   //   it('should return 406 if email is not provided', async () => {
//   //     expect.assertions(2);

//   //     const { status, body } = await exec({});

//   //     expect(status).toBe(406);
//   //     expect(body).toHaveProperty('error.message', 'Please provide your email');
//   //   });

//   //   it('should return 406 if email is not a valid email', async () => {
//   //     expect.assertions(2);

//   //     const { status, body } = await exec({ email: 'mdshifut' });

//   //     expect(status).toBe(406);
//   //     expect(body).toHaveProperty(
//   //       'error.message',
//   //       'Please provide a valid email'
//   //     );
//   //   });

//   //   it('should return 406 if password is not provided', async () => {
//   //     expect.assertions(2);

//   //     const { status, body } = await exec({ email: 'mdshifut@gmail.com' });

//   //     expect(status).toBe(406);
//   //     expect(body).toHaveProperty(
//   //       'error.message',
//   //       'Please provide your password'
//   //     );
//   //   });

//   //   it('should return 404 if user not found', async () => {
//   //     expect.assertions(2);

//   //     const { status, body } = await exec({
//   //       email: 'mdshifut@gmail.com',
//   //       password: 'somePassword'
//   //     });

//   //     expect(status).toBe(404);
//   //     expect(body).toHaveProperty('error.message', 'User not found');
//   //   });

//   //   it('should return 403 if admin account is disabled', async () => {
//   //     expect.assertions(2);

//   //     await User.create({ ...dataBaseData, isDisable: true });

//   //     const { status, body } = await exec({
//   //       email: dataBaseData.email,
//   //       password: 'somePassword'
//   //     });

//   //     expect(status).toBe(403);
//   //     expect(body).toHaveProperty(
//   //       'error.message',
//   //       'Your account has been disabled'
//   //     );
//   //   });

//   //   it('should return 406 if admin account is not activated', async () => {
//   //     expect.assertions(3);

//   //     await User.create({ ...dataBaseData });

//   //     const { status, body } = await exec({
//   //       email: dataBaseData.email,
//   //       password: 'somePassword'
//   //     });

//   //     expect(mailSender).toHaveBeenCalledTimes(1);
//   //     expect(status).toBe(406);
//   //     expect(body).toHaveProperty(
//   //       'error.message',
//   //       "Your account isn't activated yet.A new activation link send to your email.Please verify your email"
//   //     );
//   //   });

//   //   it('should return 401 if password do not match', async () => {
//   //     expect.assertions(2);

//   //     await User.create({ ...dataBaseData, isActivated: true });

//   //     const { status, body } = await exec({
//   //       email: dataBaseData.email,
//   //       password: 'somePassword'
//   //     });

//   //     expect(status).toBe(401);
//   //     expect(body).toHaveProperty(
//   //       'error.message',
//   //       "Email or password doesn't match"
//   //     );
//   //   });

//   //   it('should return 200 if login successful', async () => {
//   //     expect.assertions(3);
//   //     const hash = await bcrypt.hash('somePassword', 10);
//   //     await User.create({
//   //       ...dataBaseData,
//   //       isActivated: true,
//   //       hashPassword: hash
//   //     });

//   //     const { status, body, header } = await exec({
//   //       email: dataBaseData.email,
//   //       password: 'somePassword'
//   //     });

//   //     expect(cookie.parse(header['set-cookie'][0])).toHaveProperty(
//   //       'x-access-token'
//   //     );

//   //     expect(status).toBe(200);
//   //     expect(body).toHaveProperty('message', 'Login successful');
//   //   });
//   // }); // ================================================================
//   // // ======================= Forgot password ========================
//   // // ===============================================================
//   // describe('POST /forgot-password', () => {
//   //   const exec = value => {
//   //     return request(server)
//   //       .post(`/api/admin/forgot-password`)
//   //       .send(value);
//   //   };

//   //   it('should return 406 if email is not provided', async () => {
//   //     expect.assertions(2);

//   //     const { status, body } = await exec({});

//   //     expect(status).toBe(406);
//   //     expect(body).toHaveProperty('error.message', 'Please provide your email');
//   //   });

//   //   it('should return 406 if email is not valid', async () => {
//   //     expect.assertions(2);

//   //     const { status, body } = await exec({ email: 'invalid' });

//   //     expect(status).toBe(406);
//   //     expect(body).toHaveProperty(
//   //       'error.message',
//   //       'Please provide a valid email'
//   //     );
//   //   });

//   //   it('should return 404 if user not found', async () => {
//   //     expect.assertions(2);

//   //     const { status, body } = await exec({ email: 'mdshifut@gmail.com' });

//   //     expect(status).toBe(404);
//   //     expect(body).toHaveProperty('error.message', 'User not found');
//   //   });

//   //   it('should return 200 if password reset email sent successfully', async () => {
//   //     expect.assertions(2);
//   //     await User.create({
//   //       ...dataBaseData,
//   //       isActivated: true
//   //     });
//   //     const { status, body } = await exec({ email: dataBaseData.email });

//   //     expect(status).toBe(200);
//   //     expect(body).toHaveProperty(
//   //       'message',
//   //       'Password reset link has been sent to you email'
//   //     );
//   //   });
//   // });

//   // // ================================================================
//   // // ======================= Reset Password ========================
//   // // ===============================================================
//   // describe('POST /reset-password', () => {
//   //   const exec = (value, token) => {
//   //     return request(server)
//   //       .post(`/api/admin/reset-password?token=${token}`)
//   //       .send(value);
//   //   };

//   //   it('should return 406 if password is not provided', async () => {
//   //     expect.assertions(2);

//   //     const { status, body } = await exec({});

//   //     expect(status).toBe(406);
//   //     expect(body).toHaveProperty(
//   //       'error.message',
//   //       'Please provide your password'
//   //     );
//   //   });
//   //   it('should return 406 if confirm password is not provided', async () => {
//   //     expect.assertions(2);

//   //     const { status, body } = await exec({ password: 'someValidPassword' });

//   //     expect(status).toBe(406);
//   //     expect(body).toHaveProperty(
//   //       'error.message',
//   //       'Please confirm your password'
//   //     );
//   //   });
//   //   it('should return 406 if confirm password is not match', async () => {
//   //     expect.assertions(2);

//   //     const { status, body } = await exec({
//   //       password: 'someValidPassword',
//   //       confirmPassword: 'diffrentPassword'
//   //     });

//   //     expect(status).toBe(406);
//   //     expect(body).toHaveProperty(
//   //       'error.message',
//   //       'Please confirm your password'
//   //     );
//   //   });

//   //   it('should return 406 if token is invalid', async () => {
//   //     expect.assertions(2);

//   //     const { status, body } = await exec(
//   //       {
//   //         password: 'someValidPassword',
//   //         confirmPassword: 'someValidPassword'
//   //       },
//   //       '4edd40c86762e0fb12000003'
//   //     );

//   //     expect(status).toBe(406);
//   //     expect(body).toHaveProperty(
//   //       'error.message',
//   //       'Invalid password reset link'
//   //     );
//   //   });

//   //   it('should return 406 if token is expired', async () => {
//   //     expect.assertions(2);

//   //     const admin = await User.create(dataBaseData);
//   //     const token = await tokenGenerator({
//   //       _id: User._id,
//   //       valid: '0.1ms'
//   //     });
//   //     const { status, body } = await exec(
//   //       {
//   //         password: 'someValidPassword',
//   //         confirmPassword: 'someValidPassword'
//   //       },
//   //       token
//   //     );

//   //     expect(status).toBe(406);
//   //     expect(body).toHaveProperty(
//   //       'error.message',
//   //       'Password reset link expired'
//   //     );
//   //   });
//   //   it("should return 406 if user id isn't valid", async () => {
//   //     expect.assertions(2);

//   //     const token = await tokenGenerator({
//   //       _id: '5df091c24f2d7f6sf2ab4sf24692'
//   //     });

//   //     const { status, body } = await exec(
//   //       {
//   //         password: 'someValidPassword',
//   //         confirmPassword: 'someValidPassword'
//   //       },
//   //       token
//   //     );

//   //     expect(status).toBe(406);
//   //     expect(body).toHaveProperty('error.message', 'Invalid ID');
//   //   });

//   //   it('should return 404 if user not found', async () => {
//   //     expect.assertions(2);

//   //     const token = await tokenGenerator({
//   //       _id: '5df091c24f2d7f62ab424692'
//   //     });

//   //     const { status, body } = await exec(
//   //       {
//   //         password: 'someValidPassword',
//   //         confirmPassword: 'someValidPassword'
//   //       },
//   //       token
//   //     );

//   //     expect(status).toBe(404);
//   //     expect(body).toHaveProperty('error.message', 'User not found');
//   //   });

//   //   it('should return 200 if  password reset successfully', async () => {
//   //     expect.assertions(3);

//   //     const admin = await User.create(dataBaseData);
//   //     const token = await tokenGenerator({
//   //       _id: User._id
//   //     });

//   //     const { status, body } = await exec(
//   //       {
//   //         password: 'someValidPassword',
//   //         confirmPassword: 'someValidPassword'
//   //       },
//   //       token
//   //     );

//   //     expect(mailSender).toHaveBeenCalledTimes(1);
//   //     expect(status).toBe(200);
//   //     expect(body).toHaveProperty('message', 'Password reset successfully');
//   //   });
//   // });

//   // // ================================================================
//   // // ======================= Change Password ========================
//   // // ===============================================================
//   // describe('POST /change-password', () => {
//   //   const exec = value => {
//   //     return request(server)
//   //       .put(`/api/admin/change-password`)
//   //       .send(value);
//   //   };

//   //   it('should return 406 if current password is not provided', async () => {
//   //     expect.assertions(2);

//   //     const { status, body } = await exec({});

//   //     expect(status).toBe(406);
//   //     expect(body).toHaveProperty(
//   //       'error.message',
//   //       'Please provide current password'
//   //     );
//   //   });
//   //   it('should return 406 if new password is not provided', async () => {
//   //     expect.assertions(2);

//   //     const { status, body } = await exec({
//   //       currentPassword: 'someValidPassword'
//   //     });

//   //     expect(status).toBe(406);
//   //     expect(body).toHaveProperty(
//   //       'error.message',
//   //       'Please provide new password'
//   //     );
//   //   });

//   //   it('should return 406 if confirm new password is not provided', async () => {
//   //     expect.assertions(2);

//   //     const { status, body } = await exec({
//   //       currentPassword: 'someValidPassword',
//   //       newPassword: 'someValidNewPassword'
//   //     });

//   //     expect(status).toBe(406);
//   //     expect(body).toHaveProperty(
//   //       'error.message',
//   //       'Please confirm new password'
//   //     );
//   //   });

//   //   it('should return 406 if confirm new password do not matched', async () => {
//   //     expect.assertions(2);

//   //     const { status, body } = await exec({
//   //       currentPassword: 'someValidPassword',
//   //       newPassword: 'someValidNewPassword',
//   //       confirmNewPassword: 'notMatchedPass'
//   //     });

//   //     expect(status).toBe(406);
//   //     expect(body).toHaveProperty(
//   //       'error.message',
//   //       "Confirm new password doesn't matched"
//   //     );
//   //   });

//   //   it('should return 401 if  authorization failed', async () => {
//   //     expect.assertions(2);

//   //     const { status, body } = await exec({
//   //       currentPassword: 'someValidPassword',
//   //       newPassword: 'someValidNewPassword',
//   //       confirmNewPassword: 'someValidNewPassword'
//   //     });

//   //     expect(status).toBe(401);
//   //     expect(body).toHaveProperty(
//   //       'error.message',
//   //       'Authentication failed. Please login'
//   //     );
//   //   });

//   //   it('should return 406 if current password is invalid', async () => {
//   //     expect.assertions(2);

//   //     const admin = await User.create(dataBaseData);
//   //     const accessToken = await generateAccessToken(admin);

//   //     const { status, body } = await exec({
//   //       currentPassword: 'someValidPassword',
//   //       newPassword: 'someValidNewPassword',
//   //       confirmNewPassword: 'someValidNewPassword'
//   //     }).set('Cookie', [`x-access-token=${accessToken}`]);

//   //     expect(status).toBe(406);
//   //     expect(body).toHaveProperty('error.message', 'Invalid current password');
//   //   });

//   //   it('should return 200 if  password change successfully', async () => {
//   //     expect.assertions(3);

//   //     const hash = await bcrypt.hash('somePassword', 10);
//   //     const admin = await User.create({
//   //       ...dataBaseData,
//   //       isActivated: true,
//   //       hashPassword: hash
//   //     });

//   //     const accessToken = await generateAccessToken(admin);

//   //     const { status, body } = await exec({
//   //       currentPassword: 'somePassword',
//   //       newPassword: 'someValidNewPassword',
//   //       confirmNewPassword: 'someValidNewPassword'
//   //     }).set('Cookie', [`x-access-token=${accessToken}`]);

//   //     expect(mailSender).toHaveBeenCalledTimes(1);

//   //     expect(status).toBe(200);
//   //     expect(body).toHaveProperty('message', 'Password change successfully');
//   //   });
//   // });

//   // // ==================================================================
//   // // ======================= get admins========================
//   // // ===============================================================
//   // describe('GET /get-admins', () => {
//   //   const exec = () => {
//   //     return request(server).get('/api/admin/get-admins');
//   //   };

//   //   it('should return 401 if user is not authenticate', async () => {
//   //     expect.assertions(2);

//   //     const { status, body } = await exec();

//   //     expect(status).toBe(401);
//   //     expect(body).toHaveProperty(
//   //       'error.message',
//   //       'Authentication failed. Please login'
//   //     );
//   //   });

//   //   it('should return 403 if user is not an admin', async () => {
//   //     expect.assertions(2);

//   //     const user = await User.create(_.omit(dataBaseData, ['role']));
//   //     const token = await generateAccessToken(user);

//   //     const { status, body } = await exec({}).set('Cookie', [
//   //       `x-access-token=${token}`
//   //     ]);

//   //     expect(status).toBe(403);
//   //     expect(body).toHaveProperty(
//   //       'error.message',
//   //       "Access denied. you aren't permitted to doing this action"
//   //     );
//   //   });

//   //   it('should return 403 if admin has no permission', async () => {
//   //     expect.assertions(2);

//   //     const user = await User.create({
//   //       ...dataBaseData,
//   //       role: 'MANAGER'
//   //     });
//   //     const token = await generateAccessToken(user);

//   //     const { status, body } = await exec({}).set('Cookie', [
//   //       `x-access-token=${token}`
//   //     ]);

//   //     expect(status).toBe(403);
//   //     expect(body).toHaveProperty(
//   //       'error.message',
//   //       "Access denied. you aren't permitted to doing this action"
//   //     );
//   //   });

//   //   it('should  send empty array if no admin found', async () => {
//   //     expect.hasAssertions();

//   //     const user = await User.create(dataBaseData);

//   //     const token = await generateAccessToken(user);

//   //     const { status, body } = await exec().set('Cookie', [
//   //       `x-access-token=${token}`
//   //     ]);

//   //     expect(status).toBe(200);
//   //     expect(body).toStrictEqual([]);
//   //   });
//   //   it('should send array of admins', async () => {
//   //     expect.hasAssertions();

//   //     const user = await User.create(dataBaseData);
//   //     await User.create({
//   //       ...dataBaseData,
//   //       role: 'MANAGER',
//   //       email: 'mdshifut12@gmail.com'
//   //     });
//   //     const token = await generateAccessToken(user);

//   //     const { status, body } = await exec().set('Cookie', [
//   //       `x-access-token=${token}`
//   //     ]);

//   //     expect(status).toBe(200);
//   //     expect(body[0]).toHaveProperty('role', 'MANAGER');
//   //   });
//   // });
//   // // ==================================================================
//   // // ======================= change admin role ========================
//   // // ===============================================================
//   // describe('PUT /change-role/:adminId', () => {
//   //   const exec = (value, adminId) => {
//   //     return request(server)
//   //       .put(`/api/admin/change-role/${adminId}`)
//   //       .send(value);
//   //   };

//   //   it('should return 406 if role is not provided', async () => {
//   //     expect.assertions(2);

//   //     const { status, body } = await exec({}, '5df1ce9ccd6f802cb3181e8f');

//   //     expect(status).toBe(406);
//   //     expect(body).toHaveProperty('error.message', 'Please provide a role');
//   //   });

//   //   it('should return 406 if role is not valid', async () => {
//   //     expect.assertions(2);

//   //     const { status, body } = await exec(
//   //       { role: 'invalid' },
//   //       '5df1ce9ccd6f802cb3181e8f'
//   //     );

//   //     expect(status).toBe(406);
//   //     expect(body).toHaveProperty(
//   //       'error.message',
//   //       'invalid is not a valid role'
//   //     );
//   //   });

//   //   it('should return 401 if user is not authenticate', async () => {
//   //     expect.assertions(2);

//   //     const { status, body } = await exec(
//   //       { role: 'BASIC' },
//   //       '5df1ce9ccd6f802cb3181e8f'
//   //     );

//   //     expect(status).toBe(401);
//   //     expect(body).toHaveProperty(
//   //       'error.message',
//   //       'Authentication failed. Please login'
//   //     );
//   //   });

//   //   it('should return 403 if user is not an admin', async () => {
//   //     expect.assertions(2);

//   //     const user = await User.create(_.omit(dataBaseData, ['role']));
//   //     const token = await generateAccessToken(user);

//   //     const { status, body } = await exec(
//   //       { role: 'BASIC' },
//   //       '5df1ce9ccd6f802cb3181e8f'
//   //     ).set('Cookie', [`x-access-token=${token}`]);

//   //     expect(status).toBe(403);
//   //     expect(body).toHaveProperty(
//   //       'error.message',
//   //       "Access denied. you aren't permitted to doing this action"
//   //     );
//   //   });

//   //   it('should return 403 if admin has no permission', async () => {
//   //     expect.assertions(2);

//   //     const user = await User.create({
//   //       ...dataBaseData,
//   //       role: 'MANAGER'
//   //     });
//   //     const token = await generateAccessToken(user);

//   //     const { status, body } = await exec(
//   //       { role: 'BASIC' },
//   //       '5df1ce9ccd6f802cb3181e8f'
//   //     ).set('Cookie', [`x-access-token=${token}`]);

//   //     expect(status).toBe(403);
//   //     expect(body).toHaveProperty(
//   //       'error.message',
//   //       "Access denied. you aren't permitted to doing this action"
//   //     );
//   //   });

//   //   it('should return 404 if admin not found', async () => {
//   //     expect.hasAssertions();

//   //     const user = await User.create(dataBaseData);

//   //     const token = await generateAccessToken(user);

//   //     const { status, body } = await exec(
//   //       { role: 'BASIC' },
//   //       '5df1ce9ccd6f802cb3181e8f'
//   //     ).set('Cookie', [`x-access-token=${token}`]);

//   //     expect(status).toBe(404);
//   //     expect(body).toHaveProperty('error.message', 'User not found');
//   //   });

//   //   it('should change admin role', async () => {
//   //     expect.hasAssertions();

//   //     const user = await User.create(dataBaseData);
//   //     const admin = await User.create({
//   //       ...dataBaseData,
//   //       role: 'MANAGER',
//   //       email: 'mdshifut2@gmail.com'
//   //     });

//   //     const token = await generateAccessToken(user);

//   //     const { status, body } = await exec({ role: 'BASIC' }, User._id).set(
//   //       'Cookie',
//   //       [`x-access-token=${token}`]
//   //     );

//   //     const updatedAdmin = await User.findById(User._id);

//   //     expect(status).toBe(200);
//   //     expect(updatedAdmin).toHaveProperty('role', 'BASIC');
//   //     expect(body).toHaveProperty(
//   //       'message',
//   //       'Role has been changed successfully'
//   //     );
//   //   });
//   // });
//   // // ==================================================================
//   // // ======================= disable admin ========================
//   // // ===============================================================
//   // describe('PUT /disable-admin/:adminId', () => {
//   //   const exec = adminId => {
//   //     return request(server).put(`/api/admin/disable-admin/${adminId}`);
//   //   };

//   //   it('should return 401 if user is not authenticate', async () => {
//   //     expect.assertions(2);

//   //     const { status, body } = await exec('5df1ce9ccd6f802cb3181e8f');

//   //     expect(status).toBe(401);
//   //     expect(body).toHaveProperty(
//   //       'error.message',
//   //       'Authentication failed. Please login'
//   //     );
//   //   });

//   //   it('should return 403 if user is not an admin', async () => {
//   //     expect.assertions(2);

//   //     const user = await User.create(_.omit(dataBaseData, ['role']));
//   //     const token = await generateAccessToken(user);

//   //     const { status, body } = await exec('5df1ce9ccd6f802cb3181e8f').set(
//   //       'Cookie',
//   //       [`x-access-token=${token}`]
//   //     );

//   //     expect(status).toBe(403);
//   //     expect(body).toHaveProperty(
//   //       'error.message',
//   //       "Access denied. you aren't permitted to doing this action"
//   //     );
//   //   });

//   //   it('should return 403 if admin has no permission', async () => {
//   //     expect.assertions(2);

//   //     const user = await User.create({
//   //       ...dataBaseData,
//   //       role: 'MANAGER'
//   //     });
//   //     const token = await generateAccessToken(user);

//   //     const { status, body } = await exec('5df1ce9ccd6f802cb3181e8f').set(
//   //       'Cookie',
//   //       [`x-access-token=${token}`]
//   //     );

//   //     expect(status).toBe(403);
//   //     expect(body).toHaveProperty(
//   //       'error.message',
//   //       "Access denied. you aren't permitted to doing this action"
//   //     );
//   //   });

//   //   it('should return 404 if admin not found', async () => {
//   //     expect.hasAssertions();

//   //     const user = await User.create(dataBaseData);

//   //     const token = await generateAccessToken(user);

//   //     const { status, body } = await exec('5df1ce9ccd6f802cb3181e8f').set(
//   //       'Cookie',
//   //       [`x-access-token=${token}`]
//   //     );

//   //     expect(status).toBe(404);
//   //     expect(body).toHaveProperty('error.message', 'User not found');
//   //   });

//   //   it('should disable an admin', async () => {
//   //     expect.hasAssertions();

//   //     const user = await User.create(dataBaseData);
//   //     const admin = await User.create({
//   //       ...dataBaseData,
//   //       role: 'MANAGER',
//   //       email: 'mdshifut2@gmail.com'
//   //     });

//   //     const token = await generateAccessToken(user);

//   //     const { status, body } = await exec(User._id).set('Cookie', [
//   //       `x-access-token=${token}`
//   //     ]);

//   //     const updatedAdmin = await User.findById(User._id);

//   //     expect(status).toBe(200);
//   //     expect(updatedAdmin).toHaveProperty('isDisable', true);
//   //     expect(body).toHaveProperty('message', 'Admin disabled successfully');
//   //   });
//   // });
//   // // ==================================================================
//   // // ======================= enable admin ========================
//   // // ===============================================================
//   // describe('PUT /enable-admin/:adminId', () => {
//   //   const exec = adminId => {
//   //     return request(server).put(`/api/admin/enable-admin/${adminId}`);
//   //   };

//   //   it('should return 401 if user is not authenticate', async () => {
//   //     expect.assertions(2);

//   //     const { status, body } = await exec('5df1ce9ccd6f802cb3181e8f');

//   //     expect(status).toBe(401);
//   //     expect(body).toHaveProperty(
//   //       'error.message',
//   //       'Authentication failed. Please login'
//   //     );
//   //   });

//   //   it('should return 403 if user is not an admin', async () => {
//   //     expect.assertions(2);

//   //     const user = await User.create(_.omit(dataBaseData, ['role']));
//   //     const token = await generateAccessToken(user);

//   //     const { status, body } = await exec('5df1ce9ccd6f802cb3181e8f').set(
//   //       'Cookie',
//   //       [`x-access-token=${token}`]
//   //     );

//   //     expect(status).toBe(403);
//   //     expect(body).toHaveProperty(
//   //       'error.message',
//   //       "Access denied. you aren't permitted to doing this action"
//   //     );
//   //   });

//   //   it('should return 403 if admin has no permission', async () => {
//   //     expect.assertions(2);

//   //     const user = await User.create({
//   //       ...dataBaseData,
//   //       role: 'MANAGER'
//   //     });
//   //     const token = await generateAccessToken(user);

//   //     const { status, body } = await exec('5df1ce9ccd6f802cb3181e8f').set(
//   //       'Cookie',
//   //       [`x-access-token=${token}`]
//   //     );

//   //     expect(status).toBe(403);
//   //     expect(body).toHaveProperty(
//   //       'error.message',
//   //       "Access denied. you aren't permitted to doing this action"
//   //     );
//   //   });

//   //   it('should return 404 if admin not found', async () => {
//   //     expect.hasAssertions();

//   //     const user = await User.create(dataBaseData);

//   //     const token = await generateAccessToken(user);

//   //     const { status, body } = await exec('5df1ce9ccd6f802cb3181e8f').set(
//   //       'Cookie',
//   //       [`x-access-token=${token}`]
//   //     );

//   //     expect(status).toBe(404);
//   //     expect(body).toHaveProperty('error.message', 'User not found');
//   //   });

//   //   it('should enable an admin', async () => {
//   //     expect.hasAssertions();

//   //     const user = await User.create(dataBaseData);
//   //     const admin = await User.create({
//   //       ...dataBaseData,
//   //       role: 'MANAGER',
//   //       email: 'mdshifut2@gmail.com',
//   //       isDisable: true
//   //     });

//   //     const token = await generateAccessToken(user);

//   //     const { status, body } = await exec(User._id).set('Cookie', [
//   //       `x-access-token=${token}`
//   //     ]);

//   //     const updatedAdmin = await User.findById(User._id);

//   //     expect(status).toBe(200);
//   //     expect(updatedAdmin).toHaveProperty('isDisable', false);
//   //     expect(body).toHaveProperty('message', 'Admin enable successfully');
//   //   });
//   // });
//   // // ==================================================================
//   // // ======================= change settings ========================
//   // // ===============================================================
//   // describe('PUT /change-settings', () => {
//   //   const exec = value => {
//   //     return request(server)
//   //       .put(`/api/admin/edit-profile`)
//   //       .send(value);
//   //   };

//   //   it('should return 406 if firstName is not provided', async () => {
//   //     expect.hasAssertions();

//   //     const user = await User.create(dataBaseData);

//   //     const token = await generateAccessToken(user);

//   //     const { status, body } = await exec({ lastName: 'Hossain' }).set(
//   //       'Cookie',
//   //       [`x-access-token=${token}`]
//   //     );

//   //     expect(status).toBe(406);
//   //     expect(body).toHaveProperty(
//   //       'error.message',
//   //       'Please provide your first name'
//   //     );
//   //   });

//   //   it('should return 406 if lastName is not provided', async () => {
//   //     expect.hasAssertions();

//   //     const user = await User.create(dataBaseData);

//   //     const token = await generateAccessToken(user);

//   //     const { status, body } = await exec({ firstName: 'Shifut' }).set(
//   //       'Cookie',
//   //       [`x-access-token=${token}`]
//   //     );

//   //     expect(status).toBe(406);
//   //     expect(body).toHaveProperty(
//   //       'error.message',
//   //       'Please provide your last name'
//   //     );
//   //   });

//   //   it('should return 401 if user is not authenticate', async () => {
//   //     expect.assertions(2);

//   //     const { status, body } = await exec({
//   //       firstName: 'Rahim',
//   //       lastName: 'Rahman'
//   //     });

//   //     expect(status).toBe(401);
//   //     expect(body).toHaveProperty(
//   //       'error.message',
//   //       'Authentication failed. Please login'
//   //     );
//   //   });

//   //   it('should return 200 if  profile is updated', async () => {
//   //     expect.hasAssertions();

//   //     const user = await User.create(dataBaseData);

//   //     const token = await generateAccessToken(user);

//   //     const { status, body } = await exec({
//   //       firstName: 'Rahim',
//   //       lastName: 'Rahman'
//   //     }).set('Cookie', [`x-access-token=${token}`]);

//   //     const updatedAdmin = await User.findById(user._id);

//   //     expect(status).toBe(200);
//   //     expect(updatedUser.profile).toHaveProperty('firstName', 'Rahim');
//   //     expect(body).toHaveProperty('message', 'Profile update successfully');
//   //   });
//   // });
// });
