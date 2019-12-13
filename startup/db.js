const mongoose = require('mongoose');
const config = require('config');

const logger = require('../logger/logger');

module.exports = () => {
  mongoose
    .connect(config.get('DB'), {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    .then(() => logger.info(`Mongodb connected successfully`));
};
