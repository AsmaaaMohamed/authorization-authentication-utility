import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  createWorkspaceInvitationSchema,
  acceptWorkspaceInvitationSchema,
} from '../src/validators/workspaceInvitation.validation.js';

describe('Workspace Invitation Validation Schemas', () => {
  describe('acceptWorkspaceInvitationSchema', () => {
    it('passes with a valid inviteToken', () => {
      const result = acceptWorkspaceInvitationSchema.safeParse({
        inviteToken: 'abc123token456',
      });

      assert.equal(result.success, true);
      assert.equal(result.data.inviteToken, 'abc123token456');
    });

    it('trims whitespace from inviteToken', () => {
      const result = acceptWorkspaceInvitationSchema.safeParse({
        inviteToken: '   token-with-spaces   ',
      });

      assert.equal(result.success, true);
      assert.equal(result.data.inviteToken, 'token-with-spaces');
    });

    it('fails when inviteToken is missing', () => {
      const result = acceptWorkspaceInvitationSchema.safeParse({});

      assert.equal(result.success, false);
      const errors = result.error.flatten().fieldErrors;
      assert.ok(errors.inviteToken);
    });

    it('fails when inviteToken is an empty string', () => {
      const result = acceptWorkspaceInvitationSchema.safeParse({
        inviteToken: '   ',
      });

      assert.equal(result.success, false);
      const errors = result.error.flatten().fieldErrors;
      assert.ok(errors.inviteToken);
    });
  });

  describe('createWorkspaceInvitationSchema', () => {
    it('passes with valid email and allowed role', () => {
      const result = createWorkspaceInvitationSchema.safeParse({
        email: 'colleague@example.com',
        role: 'MEMBER',
      });

      assert.equal(result.success, true);
    });

    it('fails with invalid email', () => {
      const result = createWorkspaceInvitationSchema.safeParse({
        email: 'invalid-email-format',
        role: 'ADMIN',
      });

      assert.equal(result.success, false);
    });

    it('fails with unsupported role', () => {
      const result = createWorkspaceInvitationSchema.safeParse({
        email: 'colleague@example.com',
        role: 'SUPERADMIN',
      });

      assert.equal(result.success, false);
    });
  });
});
