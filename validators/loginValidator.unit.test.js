const _ = require('lodash');
const loginValidator = require('./loginValidator');

const validData = {
  email: 'mdshifut@gmail.com',
  password: 'pass12345'
};

describe('loginValidator', () => {
  describe('email', () => {
    it('should throw an error if email is not provided', () => {
      expect.assertions(2);

      const { error } = loginValidator(_.omit(validData, ['email']));

      error.details.forEach(detail => {
        expect(detail).toHaveProperty('type', 'any.required');
        expect(detail).toHaveProperty('context.key', 'email');
      });
    });

    it('should throw an error if email is empty string', () => {
      expect.assertions(2);

      const { error } = loginValidator({
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

      const { error } = loginValidator({
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

      const { error } = loginValidator({
        ...validData,
        email: 'shiut'
      });

      error.details.forEach(detail => {
        expect(detail).toHaveProperty('type', 'string.email');
        expect(detail).toHaveProperty('context.key', 'email');
      });
    });
  }); // email

  describe('password', () => {
    it('should throw an error if password is not provided', () => {
      expect.assertions(2);

      const { error } = loginValidator(_.omit(validData, ['password']));

      error.details.forEach(detail => {
        expect(detail).toHaveProperty('type', 'any.required');
        expect(detail).toHaveProperty('context.key', 'password');
      });
    });

    it('should throw an error if password is empty string', () => {
      expect.assertions(2);

      const { error } = loginValidator({
        ...validData,
        password: ''
      });

      error.details.forEach(detail => {
        expect(detail).toHaveProperty('type', 'string.empty');
        expect(detail).toHaveProperty('context.key', 'password');
      });
    });

    it('should throw an error if password is not a string value', () => {
      expect.assertions(2);

      const { error } = loginValidator({
        ...validData,
        password: 3333
      });

      error.details.forEach(detail => {
        expect(detail).toHaveProperty('type', 'string.base');
        expect(detail).toHaveProperty('context.key', 'password');
      });
    });
  }); // password
}); // confirmPassword
