import { z } from 'zod';

export const createWorkspaceInvitationSchema = z.object({
  email: z.email('Invalid email address'),
  role: z.enum(['ADMIN', 'MEMBER'], {
    message: 'Role must be either ADMIN or MEMBER',
  }),
});

export const acceptWorkspaceInvitationSchema = z.object({
  inviteToken: z
    .string({ required_error: 'inviteToken is required' })
    .trim()
    .min(1, 'inviteToken is required'),
});
