const _ = require('lodash');
const resetPasswordValidator = require('./resetPasswordValidator');

describe('Reset password validator', () => {
  describe('password', () => {
    it('should throw an error if password is not provided', () => {
      expect.assertions(2);

      const { error } = resetPasswordValidator({});

      error.details.forEach(detail => {
        expect(detail).toHaveProperty('type', 'any.required');
        expect(detail).toHaveProperty('context.key', 'password');
      });
    });

    it('should throw an error if password is empty string', () => {
      expect.assertions(2);

      const { error } = resetPasswordValidator({
        password: ''
      });

      error.details.forEach(detail => {
        expect(detail).toHaveProperty('type', 'string.empty');
        expect(detail).toHaveProperty('context.key', 'password');
      });
    });

    it('should throw an error if password less than 8 characters', () => {
      expect.assertions(2);

      const { error } = resetPasswordValidator({
        password: 'shi'
      });

      error.details.forEach(detail => {
        expect(detail).toHaveProperty('type', 'string.min');
        expect(detail).toHaveProperty('context.key', 'password');
      });
    });

    it('should throw an error if password is not a string value', () => {
      expect.assertions(2);

      const { error } = resetPasswordValidator({
        password: 3333
      });

      error.details.forEach(detail => {
        expect(detail).toHaveProperty('type', 'string.base');
        expect(detail).toHaveProperty('context.key', 'password');
      });
    });
  }); // password

  describe('confirmPassword', () => {
    it('should throw an error if confirmPassword is not provided', () => {
      expect.assertions(2);

      const { error } = resetPasswordValidator(
        _.omit({ password: 'someValidPassword' })
      );

      error.details.forEach(detail => {
        expect(detail).toHaveProperty('type', 'any.required');
        expect(detail).toHaveProperty('context.key', 'confirmPassword');
      });
    });

    it('should throw an error if password and  confirmPassword are not same', () => {
      expect.assertions(2);

      const { error } = resetPasswordValidator({
        password: 'someValidPassword',
        confirmPassword: 'notSame'
      });

      error.details.forEach(detail => {
        expect(detail).toHaveProperty('type', 'any.only');
        expect(detail).toHaveProperty('context.key', 'confirmPassword');
      });
    });
  }); // confirmPassword

  it('should return validate value if  value is valid', () => {
    expect.assertions(2);

    const { error, value } = resetPasswordValidator({
      password: 'someValidPassword',
      confirmPassword: 'someValidPassword'
    });

    expect(error).toBeUndefined();
    expect(value).toStrictEqual(
      expect.objectContaining({
        password: 'someValidPassword',
        confirmPassword: 'someValidPassword'
      })
    );
  });
});
