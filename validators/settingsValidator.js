const Joi = require('@hapi/joi');

const settingsSchema = Joi.object().keys({
  reservationEmailNotification: Joi.boolean()
    .required()
    .messages({
      'boolean.base': `reservationEmailNotification must be a boolean`,

      'any.required': `reservationEmailNotification is required`
    })
});

module.exports = value => settingsSchema.validate(value);
