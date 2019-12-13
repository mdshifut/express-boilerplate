const _ = require('lodash');
const createError = require('http-errors');
const authentication = require('./authentication');

jest.mock('http-errors');
const next = jest.fn();
describe('authentication', () => {
  beforeEach(() => {
    createError.mockRestore();
    next.mockRestore();
  });

  it("should called next and create error if req don't have the authUser", () => {
    expect.hasAssertions();
    const req = {};
    const res = {};

    authentication(req, res, next);
    expect(next).toHaveBeenCalledTimes(1);
    expect(createError).toHaveBeenCalledTimes(1);
  });

  it('should called next  have the authUser', () => {
    expect.hasAssertions();
    const req = {};
    _.set(req, 'locals.authUser', { name: 'Shifut Hossain' });
    const res = {};

    authentication(req, res, next);
    expect(next).toHaveBeenCalledTimes(1);
    expect(createError).toHaveBeenCalledTimes(0);
  });
});
