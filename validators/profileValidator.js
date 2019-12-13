const Joi = require('@hapi/joi');

const profileValidatorSchema = Joi.object().keys({
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
    })
});

module.exports = value => profileValidatorSchema.validate(value);
