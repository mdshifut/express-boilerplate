require('dotenv').config();
const express = require('express');

const app = express();
const logger = require('./logger/logger');

require('./startup/config')();
require('./startup/db')();
require('./startup/middleware')(app);
require('./startup/routes')(app);
require('./startup/validation')();

const port = process.env.PORT || 5000;
const server = app.listen(port, () =>
  logger.info(`Listening on port ${port}......`)
);

module.exports = server;
