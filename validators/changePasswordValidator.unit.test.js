const _ = require('lodash');
const changePasswordValidator = require('./changePasswordValidator');

describe('Change password validator', () => {
  describe('currentPassword', () => {
    it('should throw an error if currentPassword is not provided', () => {
      expect.assertions(2);

      const { error } = changePasswordValidator({});

      error.details.forEach(detail => {
        expect(detail).toHaveProperty('type', 'any.required');
        expect(detail).toHaveProperty('context.key', 'currentPassword');
      });
    });

    it('should throw an error if currentPassword is empty string', () => {
      expect.assertions(2);

      const { error } = changePasswordValidator({
        currentPassword: ''
      });

      error.details.forEach(detail => {
        expect(detail).toHaveProperty('type', 'string.empty');
        expect(detail).toHaveProperty('context.key', 'currentPassword');
      });
    });
  }); // currentPassword
  describe('newPassword', () => {
    it('should throw an error if newPassword is not provided', () => {
      expect.assertions(2);

      const { error } = changePasswordValidator({
        currentPassword: 'someValidCurrentPass'
      });

      error.details.forEach(detail => {
        expect(detail).toHaveProperty('type', 'any.required');
        expect(detail).toHaveProperty('context.key', 'newPassword');
      });
    });

    it('should throw an error if newPassword is empty string', () => {
      expect.assertions(2);

      const { error } = changePasswordValidator({
        currentPassword: 'somePassword',
        newPassword: ''
      });

      error.details.forEach(detail => {
        expect(detail).toHaveProperty('type', 'string.empty');
        expect(detail).toHaveProperty('context.key', 'newPassword');
      });
    });

    it('should throw an error if newPassword less than 8 characters', () => {
      expect.assertions(2);

      const { error } = changePasswordValidator({
        currentPassword: 'somePassword',
        newPassword: 'shi'
      });

      error.details.forEach(detail => {
        expect(detail).toHaveProperty('type', 'string.min');
        expect(detail).toHaveProperty('context.key', 'newPassword');
      });
    });

    it('should throw an error if newPassword is not a string value', () => {
      expect.assertions(2);

      const { error } = changePasswordValidator({
        currentPassword: 'somePassword',
        newPassword: 9999
      });

      error.details.forEach(detail => {
        expect(detail).toHaveProperty('type', 'string.base');
        expect(detail).toHaveProperty('context.key', 'newPassword');
      });
    });
  }); // password

  describe('confirmNewPassword', () => {
    it('should throw an error if confirmNewPassword is not provided', () => {
      expect.assertions(2);

      const { error } = changePasswordValidator({
        currentPassword: 'someValidPassword',
        newPassword: 'newValidPassword'
      });

      error.details.forEach(detail => {
        expect(detail).toHaveProperty('type', 'any.required');
        expect(detail).toHaveProperty('context.key', 'confirmNewPassword');
      });
    });

    it('should throw an error if password and  confirmNewPassword are not same', () => {
      expect.assertions(2);

      const { error } = changePasswordValidator({
        currentPassword: 'currentPassword',
        newPassword: 'someValidPassword',
        confirmNewPassword: 'notSame'
      });

      error.details.forEach(detail => {
        expect(detail).toHaveProperty('type', 'any.only');
        expect(detail).toHaveProperty('context.key', 'confirmNewPassword');
      });
    });
  }); // confirmPassword

  it('should return validate value if  value is valid', () => {
    expect.assertions(2);

    const { error, value } = changePasswordValidator({
      currentPassword: 'someValidPasswordCurrentPass',
      newPassword: 'someValidPassword',
      confirmNewPassword: 'someValidPassword'
    });

    expect(error).toBeUndefined();
    expect(value).toStrictEqual(
      expect.objectContaining({
        currentPassword: 'someValidPasswordCurrentPass',
        newPassword: 'someValidPassword',
        confirmNewPassword: 'someValidPassword'
      })
    );
  });
});
