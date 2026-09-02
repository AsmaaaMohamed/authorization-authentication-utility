export const baseLayout = ({ title, bodyContent, preheader = '' }) => `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${title}</title>
</head>
<body style="margin:0; padding:0; background-color:#f4f5f7; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <span style="display:none; font-size:1px; color:#f4f5f7; line-height:1px; max-height:0; max-width:0; opacity:0; overflow:hidden;">
    ${preheader}
  </span>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f5f7; padding:32px 0;">
    <tr>
      <td align="center">
        <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 1px 4px rgba(0,0,0,0.06);">

          <!-- Header -->
          <tr>
            <td style="background-color:#111827; padding:24px 32px;">
              <span style="color:#ffffff; font-size:18px; font-weight:600; letter-spacing:0.3px;">
                YourApp
              </span>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px 32px;">
              ${bodyContent}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 32px; border-top:1px solid #eaeaea;">
              <p style="margin:0; font-size:12px; color:#9ca3af; line-height:1.5;">
                This is an automated message from YourApp. If you didn't expect this email, you can safely ignore it.
              </p>
              <p style="margin:8px 0 0; font-size:12px; color:#9ca3af;">
                &copy; ${new Date().getFullYear()} YourApp. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

// Reusable OTP code box
export const otpCodeBox = (otp) => `
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0;">
    <tr>
      <td align="center">
        <div style="display:inline-block; background-color:#f3f4f6; border:1px dashed #d1d5db; border-radius:8px; padding:16px 32px;">
          <span style="font-size:32px; font-weight:700; letter-spacing:8px; color:#111827;">
            ${otp}
          </span>
        </div>
      </td>
    </tr>
  </table>
`;
