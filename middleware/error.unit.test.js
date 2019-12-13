const HTTPErrors = require('http-errors');
const error = require('./error');
const logger = require('../logger/logger');

// eslint-disable-next-line jest/prefer-spy-on
logger.error = jest.fn();

describe('error middleware', () => {
  beforeEach(() => {
    // Clear all instances and calls to constructor and all methods:
    logger.error.mockClear();
  });

  it('should log and return error with status code 500', () => {
    expect.hasAssertions();

    const err = new Error('Test Error');
    const req = {};
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(() => res)
    };

    error(err, req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.status).toHaveBeenCalledTimes(1);

    expect(res.json.mock.calls[0][0]).toHaveProperty('error.message');
    expect(res.json).toHaveBeenCalledTimes(1);

    expect(logger.error).toHaveBeenCalledWith(err.stack);
    expect(logger.error).toHaveBeenCalledTimes(1);
  });

  it('should return error with status code and details', () => {
    expect.hasAssertions();

    const details = {
      name: 'Name is required'
    };
    const err = HTTPErrors(400, 'Validation failed', { details });
    const req = {};
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(() => res)
    };

    error(err, req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.status).toHaveBeenCalledTimes(1);

    expect(res.json.mock.calls[0][0]).toHaveProperty(
      'error.message',
      'Validation failed'
    );
    expect(res.json.mock.calls[0][0]).toHaveProperty('error.details', details);
    expect(res.json).toHaveBeenCalledTimes(1);
  });
});
