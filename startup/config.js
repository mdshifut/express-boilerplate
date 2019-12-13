const config = require('config');

module.exports = () => {
  if (!config.get('JWT_SECRET_KEY'))
    throw new Error('FATAL ERROR: JWT_SECRET_KEY is not defined');

  if (!config.get('DB')) throw new Error('FATAL ERROR: DB is not defined');
};
