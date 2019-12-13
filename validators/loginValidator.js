const Joi = require('@hapi/joi');

const loginValidatorSchema = Joi.object().keys({
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
      'any.required': `Please provide your email`
    }),
  password: Joi.string()
    .trim()
    .required()
    .empty()
    .messages({
      'string.empty': `Password cannot be an empty field`,

      'any.required': `Please provide your password`
    })
});

module.exports = value => loginValidatorSchema.validate(value);
