const _ = require('lodash');
const {
  RegistrationValidator,
  createAdminValidator
} = require('./registrationValidators');

const validData = {
  firstName: 'Shifut',
  lastName: 'Hossain',
  email: 'mdshifut@gmail.com',
  password: 'pass12345',
  confirmPassword: 'pass12345'
};

describe('Registration validator', () => {
  describe('firstName', () => {
    it('should throw an error if firstName is not provided', () => {
      expect.assertions(2);

      const { error } = RegistrationValidator(_.omit(validData, ['firstName']));

      error.details.forEach(detail => {
        expect(detail).toHaveProperty('type', 'any.required');
        expect(detail).toHaveProperty('context.key', 'firstName');
      });
    });

    it('should throw an error if firstName is empty string', () => {
      expect.assertions(2);

      const { error } = RegistrationValidator({
        ...validData,
        firstName: ''
      });

      error.details.forEach(detail => {
        expect(detail).toHaveProperty('type', 'string.empty');
        expect(detail).toHaveProperty('context.key', 'firstName');
      });
    });

    it('should throw an error if firstName less than 5 characters', () => {
      expect.assertions(2);

      const { error } = RegistrationValidator({
        ...validData,
        firstName: 'shi'
      });

      error.details.forEach(detail => {
        expect(detail).toHaveProperty('type', 'string.min');
        expect(detail).toHaveProperty('context.key', 'firstName');
      });
    });

    it('should throw an error if firstName greater than 40 characters', () => {
      expect.assertions(2);

      const { error } = RegistrationValidator({
        ...validData,
        firstName: [...Array(41)].map(() => 'a').join('')
      });

      error.details.forEach(detail => {
        expect(detail).toHaveProperty('type', 'string.max');
        expect(detail).toHaveProperty('context.key', 'firstName');
      });
    });

    it('should throw an error if firstName is not a string value', () => {
      expect.assertions(2);

      const { error } = RegistrationValidator({
        ...validData,
        firstName: 3333
      });

      error.details.forEach(detail => {
        expect(detail).toHaveProperty('type', 'string.base');
        expect(detail).toHaveProperty('context.key', 'firstName');
      });
    });
  }); // firstName

  describe('lastName', () => {
    it('should throw an error if lastName is not provided', () => {
      expect.assertions(2);

      const { error } = RegistrationValidator(_.omit(validData, ['lastName']));

      error.details.forEach(detail => {
        expect(detail).toHaveProperty('type', 'any.required');
        expect(detail).toHaveProperty('context.key', 'lastName');
      });
    });

    it('should throw an error if lastName is empty string', () => {
      expect.assertions(2);

      const { error } = RegistrationValidator({
        ...validData,
        lastName: ''
      });

      error.details.forEach(detail => {
        expect(detail).toHaveProperty('type', 'string.empty');
        expect(detail).toHaveProperty('context.key', 'lastName');
      });
    });

    it('should throw an error if lastName less than 5 characters', () => {
      expect.assertions(2);

      const { error } = RegistrationValidator({
        ...validData,
        lastName: 'shi'
      });

      error.details.forEach(detail => {
        expect(detail).toHaveProperty('type', 'string.min');
        expect(detail).toHaveProperty('context.key', 'lastName');
      });
    });

    it('should throw an error if lastName greater than 40 characters', () => {
      expect.assertions(2);

      const { error } = RegistrationValidator({
        ...validData,
        lastName: [...Array(41)].map(() => 'a').join('')
      });

      error.details.forEach(detail => {
        expect(detail).toHaveProperty('type', 'string.max');
        expect(detail).toHaveProperty('context.key', 'lastName');
      });
    });

    it('should throw an error if lastName is not a string value', () => {
      expect.assertions(2);

      const { error } = RegistrationValidator({
        ...validData,
        lastName: 3333
      });

      error.details.forEach(detail => {
        expect(detail).toHaveProperty('type', 'string.base');
        expect(detail).toHaveProperty('context.key', 'lastName');
      });
    });
  }); // lastName

  describe('email', () => {
    it('should throw an error if email is not provided', () => {
      expect.assertions(2);

      const { error } = RegistrationValidator(_.omit(validData, ['email']));

      error.details.forEach(detail => {
        expect(detail).toHaveProperty('type', 'any.required');
        expect(detail).toHaveProperty('context.key', 'email');
      });
    });

    it('should throw an error if email is empty string', () => {
      expect.assertions(2);

      const { error } = RegistrationValidator({
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

      const { error } = RegistrationValidator({
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

      const { error } = RegistrationValidator({
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

      const { error } = RegistrationValidator(_.omit(validData, ['password']));

      error.details.forEach(detail => {
        expect(detail).toHaveProperty('type', 'any.required');
        expect(detail).toHaveProperty('context.key', 'password');
      });
    });

    it('should throw an error if password is empty string', () => {
      expect.assertions(2);

      const { error } = RegistrationValidator({
        ...validData,
        password: ''
      });

      error.details.forEach(detail => {
        expect(detail).toHaveProperty('type', 'string.empty');
        expect(detail).toHaveProperty('context.key', 'password');
      });
    });

    it('should throw an error if password less than 8 characters', () => {
      expect.assertions(2);

      const { error } = RegistrationValidator({
        ...validData,
        password: 'shi'
      });

      error.details.forEach(detail => {
        expect(detail).toHaveProperty('type', 'string.min');
        expect(detail).toHaveProperty('context.key', 'password');
      });
    });

    it('should throw an error if password is not a string value', () => {
      expect.assertions(2);

      const { error } = RegistrationValidator({
        ...validData,
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

      const { error } = RegistrationValidator(
        _.omit(validData, ['confirmPassword'])
      );

      error.details.forEach(detail => {
        expect(detail).toHaveProperty('type', 'any.required');
        expect(detail).toHaveProperty('context.key', 'confirmPassword');
      });
    });

    it('should throw an error if password and  confirmPassword are not same', () => {
      expect.assertions(2);

      const { error } = RegistrationValidator({
        ...validData,
        confirmPassword: ''
      });

      error.details.forEach(detail => {
        expect(detail).toHaveProperty('type', 'any.only');
        expect(detail).toHaveProperty('context.key', 'confirmPassword');
      });
    });
  }); // confirmPassword

  it('should return validate value if  value is valid', () => {
    expect.assertions(2);

    const { error, value } = RegistrationValidator(validData);

    expect(error).toBeUndefined();
    expect(value).toStrictEqual(expect.objectContaining(validData));
  });
}); // Consultant profile update validator

describe('createAdminValidator', () => {
  it('should throw an error if role is not provided', () => {
    expect.assertions(2);

    const validAdminData = _.omit(validData, ['password', 'confirmPassword']);
    const { error } = createAdminValidator(validAdminData);

    error.details.forEach(detail => {
      expect(detail).toHaveProperty('type', 'any.required');
      expect(detail).toHaveProperty('context.key', 'role');
    });
  });

  it('should throw an error if role is not a string', () => {
    expect.assertions(2);

    const validAdminData = _.omit(validData, ['password', 'confirmPassword']);
    const { error } = createAdminValidator({ ...validAdminData, role: 333 });

    error.details.forEach(detail => {
      expect(detail).toHaveProperty('type', 'string.base');
      expect(detail).toHaveProperty('context.key', 'role');
    });
  });

  it('should throw an error if password and  confirmPassword are provided', () => {
    expect.assertions(2);

    const { error } = createAdminValidator({ ...validData, role: 'manager' });

    error.details.forEach(detail => {
      expect(detail).toHaveProperty('type', 'any.unknown');
      expect(detail).toHaveProperty('context.key', 'password');
    });
  });

  it('should return validate value if  value is valid', () => {
    expect.assertions(2);

    const validAdminData = _.omit(validData, ['password', 'confirmPassword']);

    const { error, value } = createAdminValidator({
      ...validAdminData,
      role: 'manager'
    });

    expect(error).toBeUndefined();
    expect(value).toStrictEqual(expect.objectContaining(validAdminData));
  });
}); // confirmPassword
