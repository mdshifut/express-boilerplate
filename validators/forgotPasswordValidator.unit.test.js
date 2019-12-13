const _ = require('lodash');
const forgotPasswordValidator = require('./forgotPasswordValidator');

const validData = {
  email: 'mdshifut@gmail.com',
  password: 'pass12345'
};

describe('forgotPasswordValidator', () => {
  describe('email', () => {
    it('should throw an error if email is not provided', () => {
      expect.assertions(2);

      const { error } = forgotPasswordValidator(_.omit(validData, ['email']));

      error.details.forEach(detail => {
        expect(detail).toHaveProperty('type', 'any.required');
        expect(detail).toHaveProperty('context.key', 'email');
      });
    });

    it('should throw an error if email is empty string', () => {
      expect.assertions(2);

      const { error } = forgotPasswordValidator({
        ...validData,
        email: ''
      });

      error.details.forEach(detail => {
        expect(detail).toHaveProperty('type', 'string.empty');
        expect(detail).toHaveProperty('context.key', 'email');
      });
    });

    it('should throw an error if email is not a string value', () => {
      expect.assertions(2);

      const { error } = forgotPasswordValidator({
        ...validData,
        email: 3333
      });

      error.details.forEach(detail => {
        expect(detail).toHaveProperty('type', 'string.base');
        expect(detail).toHaveProperty('context.key', 'email');
      });
    });

    it('should throw an error if email is not a valid email', () => {
      expect.assertions(2);

      const { error } = forgotPasswordValidator({
        ...validData,
        email: 'shiut'
      });

      error.details.forEach(detail => {
        expect(detail).toHaveProperty('type', 'string.email');
        expect(detail).toHaveProperty('context.key', 'email');
      });
    });
  }); // email
}); // confirmPassword
