const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = ({ _id, role, email, profile }) => {
  const payload = {
    user: {
      _id,
      name: `${profile.firstName} ${profile.lastName}`,
      email
    }
  };

  // If user is an admin then add admin role
  if (role) {
    payload.user.role = role;
  }

  return jwt.sign(payload, config.get('JWT_SECRET_KEY'), {
    expiresIn: config.get('LOGIN_EXPIRED_TIME')
  });
};
