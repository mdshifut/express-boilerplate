const Joi = require('@hapi/joi');

const passwordResetValidatorSchema = Joi.object().keys({
  password: Joi.string()
    .trim()
    .required()
    .empty()
    .min(8)
    .messages({
      'string.base': `Password should be a type of 'text'`,
      'string.empty': `Password cannot be an empty field`,
      'string.min': `Password should have a minimum length of {#limit}`,
      'any.required': `Please provide your password`
    }),
  confirmPassword: Joi.string()
    .empty()
    .valid(Joi.ref('password'))
    .required()
    .messages({
      'any.required': `Please confirm your password`,
      'any.only': `Please confirm your password`
    })
});

module.exports = value => passwordResetValidatorSchema.validate(value);
