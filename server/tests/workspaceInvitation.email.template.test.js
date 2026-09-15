import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { workspaceInvitationTemplate } from '../src/utilities/emailTemplates/workspace-invitation.js';

describe('Workspace invitation email template', () => {
  it('includes a cookie-based accept button without a token query string', () => {
    const html = workspaceInvitationTemplate({
      workspaceName: 'Product Team',
      inviterName: 'Ada',
      token: 'abc123',
    });

    assert.match(
      html,
      /href="http:\/\/localhost:5000\/api\/v1\/workspace\/invitations\/accept"/i,
    );
    assert.doesNotMatch(html, /\?inviteToken=/i);
    assert.match(html, /Accept invitation/i);
  });
});
