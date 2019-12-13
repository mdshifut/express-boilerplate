const nodemailer = require('nodemailer');
const config = require('config');

const MAIL = config.get('MAIL');

const transporter = nodemailer.createTransport({
  host: MAIL.MAIL_HOST,
  port: MAIL.MAIL_PORT,
  secure: process.NODE_ENV === 'production',
  auth: {
    user: MAIL.MAIL_USER,
    pass: MAIL.MAIL_PASS
  }
});

module.exports = transporter;
