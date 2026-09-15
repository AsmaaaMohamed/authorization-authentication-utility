import * as z from 'zod';

export const createBoardBodySchema = z.object({
  name: z.string().trim().min(1, 'Board name is required').optional(),
});

export const updateBoardBodySchema = z.object({
  name: z.string().trim().min(1).max(100).optional(),
});

export const createBoardColumnBodySchema = z.object({
  title: z.string().trim().min(1, 'Column title is required'),
  status: z
    .enum(['todo', 'in_progress', 'done'])
    .optional(),
});

export const updateBoardColumnBodySchema = z.object({
  title: z.string().trim().min(1, 'Column title is required').optional(),
  status: z
    .enum(['todo', 'in_progress', 'done'])
    .optional(),
  order: z.number().int().nonnegative().optional(),
});
