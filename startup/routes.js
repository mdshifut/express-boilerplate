const error = require('../middleware/error');
const notFound = require('../middleware/notFound');
const parseAccessToken = require('../middleware/parseAccessToken');
const adminRoutes = require('../routes/adminRoutes');
const userRoutes = require('../routes/userRoutes');

module.exports = app => {
  app.use(parseAccessToken);
  app.use('/api/admin', adminRoutes);
  app.use('/api/user', userRoutes);
  app.use(notFound);

  app.use(error);
};
