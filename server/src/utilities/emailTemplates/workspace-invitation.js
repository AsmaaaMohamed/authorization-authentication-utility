import { baseLayout } from './base-layout.js';

export const workspaceInvitationTemplate = ({
  workspaceName,
  inviterName = 'A team member',
  acceptUrl = 'http://localhost:5000/api/v1/workspace/invitations/accept',
}) =>
  baseLayout({
    title: 'Workspace invitation',
    preheader: `${inviterName} invited you to join ${workspaceName}`,
    bodyContent: `
      <h1 style="margin:0 0 12px; font-size:24px; color:#111827;">You’re invited to join ${workspaceName}</h1>
      <p style="margin:0 0 20px; font-size:15px; line-height:1.7; color:#374151;">
        <strong>${inviterName}</strong> has invited you to collaborate in <strong>${workspaceName}</strong>.
      </p>
      <p style="margin:0 0 24px; font-size:15px; line-height:1.7; color:#4b5563;">
        Click the button below to accept this invitation and start working together.
      </p>
      <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 24px;">
        <tr>
          <td align="center" bgcolor="#2563eb" style="border-radius:8px;">
            <a
              href="${acceptUrl}"
              target="_blank"
              rel="noopener noreferrer"
              style="display:inline-block; padding:14px 24px; font-size:15px; font-weight:600; color:#ffffff; text-decoration:none; border-radius:8px;"
            >
              Accept invitation
            </a>
          </td>
        </tr>
      </table>
      <p style="margin:0; font-size:13px; line-height:1.7; color:#6b7280;">
        If the button does not work, open this link in your browser:<br />
        <a href="${acceptUrl}" style="color:#2563eb; word-break:break-all;">${acceptUrl}</a>
      </p>
    `,
  });
