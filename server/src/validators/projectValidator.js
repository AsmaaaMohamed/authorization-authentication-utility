import * as z from 'zod';

export const createProjectSchema = z.object({
  name: z
    .string({
      required_error: 'Name is required',
      invalid_type_error: 'Name is required',
    })
    .trim()
    .min(1, 'Name is required'),
  description: z.string().trim().optional().default(''),
  workspaceId: z.string().trim().optional(),
});
