import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { acceptWorkspaceInvitation } from '../src/modules/workspaceInvitation/workspaceInvitation.service.js';
import { getWorkspaceMembers } from '../src/modules/workspaceMember/workspaceMember.service.js';

describe('Workspace Services Unit Tests', () => {
  describe('acceptWorkspaceInvitation', () => {
    it('throws 400 when inviteToken is missing or empty', async () => {
      await assert.rejects(
        async () => {
          await acceptWorkspaceInvitation({ inviteToken: '', userId: 'user123' });
        },
        (err) => {
          assert.equal(err.statusCode, 400);
          assert.match(err.message, /inviteToken is required/i);
          return true;
        }
      );
    });
  });

  describe('getWorkspaceMembers', () => {
    it('throws 400 when workspaceId is not a valid ObjectId', async () => {
      await assert.rejects(
        async () => {
          await getWorkspaceMembers('invalid-id', 'user123');
        },
        (err) => {
          assert.equal(err.statusCode, 400);
          assert.match(err.message, /invalid workspace id/i);
          return true;
        }
      );
    });
  });
});
