import { baseLayout } from './base-layout.js';

export const passwordResetConfirmationTemplate = () =>
  baseLayout({
    title: 'Your password was changed',
    preheader: 'Your account password was just changed',
    bodyContent: `
    <h1 style="margin:0 0 8px; font-size:20px; color:#111827;">Password changed</h1>
    <p style="margin:0 0 8px; font-size:14px; color:#4b5563; line-height:1.6;">
      Your account password was just changed successfully.
    </p>
    <p style="margin:24px 0 0; font-size:13px; color:#b91c1c; line-height:1.6;">
      If this wasn't you, please contact support immediately to secure your account.
    </p>
  `,
  });
