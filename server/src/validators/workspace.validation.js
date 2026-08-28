import { z } from 'zod';

export const createWorkspaceSchema = z.object({
  name: z.string().trim().min(1, 'Workspace name is required'),

  description: z.string().trim().optional(),

  iconUrl: z.string().trim().optional(),
});
