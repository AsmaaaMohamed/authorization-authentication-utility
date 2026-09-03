import nodemailer from 'nodemailer';
import { otpVerificationTemplate } from '../utilities/emailTemplates/otp-verification.js';
import { passwordResetConfirmationTemplate } from '../utilities/emailTemplates/password-reset-confirm.js';
import { passwordResetOtpTemplate } from '../utilities/emailTemplates/password-reset-otp.js';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const FROM_ADDRESS = process.env.MAIL_FROM || 'no-reply@workspace.com';

export const sendMail = async ({ to, subject, text, html }) => {
  return await transporter.sendMail({
    from: FROM_ADDRESS,
    to,
    subject,
    text,
    html,
  });
};

export const sendPasswordResetOtpEmail = async (to, otp, expiresInMinutes) => {
  await sendMail({
    to,
    subject: 'Your password reset code',
    text: `Your password reset code is ${otp}. It expires in ${expiresInMinutes} minutes. If you didn't request this, ignore this email.`,
    html: passwordResetOtpTemplate(otp),
  });
};

export const sendPasswordResetConfirmationEmail = async (to) => {
  await sendMail({
    to,
    subject: 'Your password was changed',
    text: `Your account password was just changed. If this wasn't you, contact support immediately.`,
    html: passwordResetConfirmationTemplate(),
  });
};

export const sendOtpVerificationEmail = async (to, otp, expiresInMinutes) => {
  await sendMail({
    to,
    subject: 'Verify your account',
    text: `Your verification code is ${otp}. It expires in ${expiresInMinutes} minutes. If you didn't create an account, ignore this email.`,
    html: otpVerificationTemplate(otp),
  });
};

export default {
  sendPasswordResetOtpEmail,
  sendPasswordResetConfirmationEmail,
};
