const Joi = require('@hapi/joi');

const roleValidatorSchema = Joi.object().keys({
  role: Joi.string()
    .required()
    .trim()
    .replace(/\s\s+/g, ' ') // Removed extra space and tabs
    .empty()
    .valid('MANAGER', 'BASIC')
    .messages({
      'any.required': `Please provide a role`,
      'any.only': `{#value} is not a valid role`
    })
});

module.exports = value => roleValidatorSchema.validate(value);
