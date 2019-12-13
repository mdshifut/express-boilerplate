const Joi = require('@hapi/joi');

const changePasswordValidatorSchema = Joi.object().keys({
  currentPassword: Joi.string()
    .trim()
    .required()
    .empty()
    .messages({
      'string.base': `Password should be a type of 'text'`,
      'string.empty': `Please provide current password`,
      'any.required': `Please provide current password`
    }),
  newPassword: Joi.string()
    .trim()
    .required()
    .empty()
    .min(8)
    .messages({
      'string.base': `New password should be a type of 'text'`,
      'string.empty': `Please provide new password`,
      'string.min': `New password should have a minimum length of {#limit}`,
      'any.required': `Please provide new password`
    }),
  confirmNewPassword: Joi.string()
    .empty()
    .valid(Joi.ref('newPassword'))
    .required()
    .messages({
      'any.required': `Please confirm new password`,
      'any.only': `Confirm new password doesn't matched`
    })
});

module.exports = value => changePasswordValidatorSchema.validate(value);
