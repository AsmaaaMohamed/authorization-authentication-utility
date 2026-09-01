import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const FROM_ADDRESS = process.env.MAIL_FROM || 'no-reply@workspace.com';

const sendMail = async ({ to, subject, text, html }) => {
  await transporter.sendMail({ from: FROM_ADDRESS, to, subject, text, html });
};

export const sendPasswordResetOtpEmail = async (to, otp) => {
  await sendMail({
    to,
    subject: 'Your password reset code',
    text: `Your password reset code is ${otp}. It expires in 5 minutes. If you didn't request this, ignore this email.`,
    html: `<p>Your password reset code is:</p><h2 style="letter-spacing:4px;">${otp}</h2><p>This code expires in 5 minutes. If you didn't request this, you can safely ignore this email.</p>`,
  });
};

export const sendPasswordResetConfirmationEmail = async (to) => {
  await sendMail({
    to,
    subject: 'Your password was changed',
    text: `Your account password was just changed. If this wasn't you, contact support immediately.`,
    html: `<p>Your account password was just changed.</p><p>If this wasn't you, please contact support immediately.</p>`,
  });
};

export default {
  sendPasswordResetOtpEmail,
  sendPasswordResetConfirmationEmail,
};
