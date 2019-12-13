const Joi = require('@hapi/joi');

const registrationValidator = Joi.object().keys({
  firstName: Joi.string()
    .required()
    .trim()
    .replace(/\s\s+/g, ' ') // Removed extra space and tabs
    .empty()
    .min(4)
    .max(40)
    .messages({
      'string.base': `First Name should be a type of text`,
      'string.empty': `First Name cannot be an empty field`,
      'string.min': `First Name should have a minimum length of {#limit}`,
      'string.max': `First Name should have a maximum length of {#limit}`,
      'any.required': `Please provide your first name`,
      'characters.min': `First Name should contain a minimum 5 non-whitespace characters`
    }),
  lastName: Joi.string()
    .required()
    .trim()
    .replace(/\s\s+/g, ' ') // Removed extra space and tabs
    .empty()
    .min(5)
    .max(40)
    .messages({
      'string.base': `Last Name should be a type of text`,
      'string.empty': `Last Name cannot be an empty field`,
      'string.min': `Last Name should have a minimum length of {#limit}`,
      'string.max': `Last Name should have a maximum length of {#limit}`,
      'any.required': `Please provide your last name`,
      'characters.min': `Last Name should contain a minimum 5 non-whitespace characters`
    }),
  email: Joi.string()
    .required()
    .trim()
    .replace(/\s\s+/g, ' ') // Removed extra space and tabs
    .empty()
    .email()
    .messages({
      'string.base': `Email should be a type of text`,
      'string.empty': `Email cannot be an empty field`,
      'string.email': `Please provide a valid email`,
      'any.required': `Please provide your email`,
      'characters.min': `Email should contain a minimum 5 non-whitespace characters`
    }),
  password: Joi.when('$isPasswordRequired', {
    is: true,
    then: Joi.string()
      .trim()
      .required()
      .empty()
      .min(8),
    otherwise: Joi.any().forbidden()
  }).messages({
    'string.base': `Password should be a type of 'text'`,
    'string.empty': `Password cannot be an empty field`,
    'string.min': `Password should have a minimum length of {#limit}`,
    'any.required': `Please provide your password`
  }),
  confirmPassword: Joi.when('$isPasswordRequired', {
    is: true,
    then: Joi.string()
      .empty()
      .valid(Joi.ref('password'))
      .required(),
    otherwise: Joi.any().forbidden()
  }).messages({
    'any.required': `Please confirm your password`,
    'any.only': `Confirm password doesn't matched`
  }),
  role: Joi.when('$isRoleRequired', {
    is: true,
    then: Joi.string()
      .empty()

      .required(),
    otherwise: Joi.any().forbidden()
  }).messages({
    'any.required': `Please select a role`,
    'string.empty': `Role cannot be an empty field`
  })
});

exports.RegistrationValidator = value =>
  registrationValidator.validate(value, {
    context: {
      isPasswordRequired: true
    }
  });

exports.createAdminValidator = value =>
  registrationValidator.validate(value, {
    context: {
      isRoleRequired: true
    }
  });
