const _ = require('lodash');
const roleValidator = require('./roleValidator');

describe('roleValidator', () => {
  it('should throw an error if role is not provided', () => {
    expect.assertions(2);

    const { error } = roleValidator({});

    error.details.forEach(detail => {
      expect(detail).toHaveProperty('type', 'any.required');
      expect(detail).toHaveProperty('context.key', 'role');
    });
  });

  it('should throw an error if role is not a valid role', () => {
    expect.assertions(2);

    const { error } = roleValidator({ role: 'STUFF' });

    error.details.forEach(detail => {
      expect(detail).toHaveProperty('type', 'any.only');
      expect(detail).toHaveProperty('context.key', 'role');
    });
  });
});
