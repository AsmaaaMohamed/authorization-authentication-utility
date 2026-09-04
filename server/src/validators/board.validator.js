import * as z from 'zod';

export const createBoardBodySchema = z.object({
  name: z.string().trim().min(1, 'Board name is required'),
});

export const updateBoardBodySchema = z.object({
  name: z.string().trim().min(1).max(100).optional(),
});
