const _ = require('lodash');

module.exports = validator => {
  return (req, res, next) => {
    const { error, value } = validator(req.body);
    if (error)
      return res
        .status(406)
        .json({ error: { message: error.details[0].message } });

    _.set(req, 'locals.validateValue', value);
    return next();
  };
};
