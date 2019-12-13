const Joi = require('@hapi/joi');

const forgotPasswordSchema = Joi.object().keys({
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
    })
});

module.exports = value => forgotPasswordSchema.validate(value);
