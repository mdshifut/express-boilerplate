const _ = require('lodash');
const createError = require('http-errors');
const Admin = require('../models/Admin');
const adminPermission = require('./adminPermission');

jest.mock('http-errors');
Admin.findById = jest.fn();
const next = jest.fn();
describe('adminPermission', () => {
  beforeEach(() => {
    createError.mockRestore();
    Admin.findById.mockRestore();
    next.mockRestore();
  });

  it("should return access denied message if user isn't an admin", async () => {
    expect.hasAssertions();
    const req = {};
    _.set(req, 'locals.authUser', {
      _id: '5df1ce9ccd6f802cb3181e8f'
    });

    Admin.findById.mockResolvedValueOnce(null);

    await adminPermission('ROOT_ADMIN')(req, {}, next);

    expect(Admin.findById).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledTimes(1);
    expect(createError).toHaveBeenCalledTimes(1);
    expect(createError).toHaveBeenLastCalledWith(
      403,
      "Access denied. you aren't permitted to doing this action"
    );
  });

  it("should return access denied message if admin hasn't permission for access this route", async () => {
    expect.hasAssertions();
    const req = {};
    _.set(req, 'locals.authUser', {
      _id: '5df1ce9ccd6f802cb3181e8f'
    });

    Admin.findById.mockResolvedValueOnce({ role: 'MANAGER', isDisable: false });

    await adminPermission('ROOT_ADMIN')(req, {}, next);
    expect(Admin.findById).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledTimes(1);
    expect(createError).toHaveBeenCalledTimes(1);
    expect(createError).toHaveBeenLastCalledWith(
      403,
      "Access denied. you aren't permitted to doing this action"
    );
  });

  it('should return access denied message if admin is disabled', async () => {
    expect.hasAssertions();
    const req = {};
    _.set(req, 'locals.authUser', {
      _id: '5df1ce9ccd6f802cb3181e8f'
    });

    Admin.findById.mockResolvedValueOnce({ role: 'MANAGER', isDisable: true });

    await adminPermission('MANAGER')(req, {}, next);
    expect(Admin.findById).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledTimes(1);
    expect(createError).toHaveBeenCalledTimes(1);
    expect(createError).toHaveBeenLastCalledWith(
      403,
      "Access denied. you aren't permitted to doing this action"
    );
  });

  it('should call next if admin has the permission to access this route', async () => {
    expect.hasAssertions();
    const req = {};
    _.set(req, 'locals.authUser', {
      _id: '5df1ce9ccd6f802cb3181e8f'
    });

    Admin.findById.mockResolvedValueOnce({
      role: 'ROOT_ADMIN',
      isDisable: false
    });
    await adminPermission('ROOT_ADMIN')(req, {}, next);
    expect(Admin.findById).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledTimes(1);
    expect(createError).not.toHaveBeenCalled();
  });
});
