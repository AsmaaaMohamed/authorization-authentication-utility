import { z } from 'zod';

export const createWorkspaceInvitationSchema = z.object({
  email: z.string().trim().email('Invalid email address'),

  role: z.enum(['ADMIN', 'MEMBER'], {
    message: 'Role must be either ADMIN or MEMBER',
  }),
});
