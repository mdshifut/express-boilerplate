const _ = require('lodash');
const profileValidator = require('./profileValidator');

const validData = {
  firstName: 'Shifut',
  lastName: 'Hossain'
};

describe('Profile validator', () => {
  describe('firstName', () => {
    it('should throw an error if firstName is not provided', () => {
      expect.assertions(2);

      const { error } = profileValidator(_.omit(validData, ['firstName']));

      error.details.forEach(detail => {
        expect(detail).toHaveProperty('type', 'any.required');
        expect(detail).toHaveProperty('context.key', 'firstName');
      });
    });

    it('should throw an error if firstName is empty string', () => {
      expect.assertions(2);

      const { error } = profileValidator({
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

      const { error } = profileValidator({
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

      const { error } = profileValidator({
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

      const { error } = profileValidator({
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

      const { error } = profileValidator(_.omit(validData, ['lastName']));

      error.details.forEach(detail => {
        expect(detail).toHaveProperty('type', 'any.required');
        expect(detail).toHaveProperty('context.key', 'lastName');
      });
    });

    it('should throw an error if lastName is empty string', () => {
      expect.assertions(2);

      const { error } = profileValidator({
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

      const { error } = profileValidator({
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

      const { error } = profileValidator({
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

      const { error } = profileValidator({
        ...validData,
        lastName: 3333
      });

      error.details.forEach(detail => {
        expect(detail).toHaveProperty('type', 'string.base');
        expect(detail).toHaveProperty('context.key', 'lastName');
      });
    });
  }); // lastName
});
