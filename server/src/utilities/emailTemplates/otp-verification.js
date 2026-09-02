import { baseLayout, otpCodeBox } from './base-layout.js';

export const otpVerificationTemplate = (otp, expiresInMinutes = 10) =>
  baseLayout({
    title: 'Verify your account',
    preheader: `Your verification code is ${otp}`,
    bodyContent: `
    <h1 style="margin:0 0 8px; font-size:20px; color:#111827;">Verify your email</h1>
    <p style="margin:0 0 8px; font-size:14px; color:#4b5563; line-height:1.6;">
      Use the code below to verify your account. This code expires in ${expiresInMinutes} minutes.
    </p>
    ${otpCodeBox(otp)}
    <p style="margin:24px 0 0; font-size:13px; color:#9ca3af; line-height:1.6;">
      If you didn't create an account, you can safely ignore this email.
    </p>
  `,
  });
