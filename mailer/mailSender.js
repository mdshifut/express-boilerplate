const config = require('config');
const transporter = require('./transporter');

module.exports = async ({
  from = config.get('NO_REPLY_EMAIL'),
  email,
  subject,
  template
}) => {
  await transporter.sendMail({
    from,
    to: email,
    subject,
    html: template
  });
};
