const nodemailer = require('nodemailer');
require('../config/env');

const isEmailConfigured = () =>
  Boolean(process.env.SMTP_HOST && process.env.SMTP_PORT && process.env.SMTP_USER && process.env.SMTP_PASSWORD);

const createTransporter = () =>
  nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });

const formatEventDate = (date) =>
  new Date(date).toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

const sendEventRegistrationEmail = async ({ user, event }) => {
  if (!isEmailConfigured()) {
    console.warn('Email skipped: SMTP settings are not configured');
    return;
  }

  const transporter = createTransporter();
  const from = process.env.MAIL_FROM || process.env.SMTP_USER;
  const eventDate = formatEventDate(event.event_date);
  const deadline = event.registration_deadline
    ? formatEventDate(event.registration_deadline)
    : 'No registration deadline';

  await transporter.sendMail({
    from,
    to: user.email,
    subject: `Registration confirmed: ${event.title}`,
    text: [
      `Hi ${user.full_name || user.email},`,
      '',
      `You have successfully registered for ${event.title}.`,
      '',
      'Event information:',
      `Date: ${eventDate}`,
      `Location: ${event.location}`,
      `Category: ${event.category || 'Not specified'}`,
      `Registration deadline: ${deadline}`,
      '',
      event.description,
      '',
      'Thank you for registering.',
    ].join('\n'),
    html: `
      <div style="font-family: Arial, sans-serif; color: #1c2f40; line-height: 1.5;">
        <h2 style="color: #18324a;">Registration confirmed</h2>
        <p>Hi ${user.full_name || user.email},</p>
        <p>You have successfully registered for <strong>${event.title}</strong>.</p>
        <h3 style="color: #18324a;">Event information</h3>
        <ul>
          <li><strong>Date:</strong> ${eventDate}</li>
          <li><strong>Location:</strong> ${event.location}</li>
          <li><strong>Category:</strong> ${event.category || 'Not specified'}</li>
          <li><strong>Registration deadline:</strong> ${deadline}</li>
        </ul>
        <p>${event.description}</p>
        <p>Thank you for registering.</p>
      </div>
    `,
  });
};

module.exports = {
  sendEventRegistrationEmail,
};
