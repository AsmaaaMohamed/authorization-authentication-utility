import { z } from 'zod';

export const createTaskSchema = z.object({
  title: z
    .string({ required_error: 'title is required' })
    .trim()
    .min(1, 'title is required'),
  description: z.string().trim().optional().default(''),
  status: z.enum(['todo', 'in_progress', 'done'], {
    required_error: 'status is required',
    invalid_type_error: 'status must be todo, in_progress, or done',
  }),
  projectId: z
    .string({ required_error: 'projectId is required' })
    .trim()
    .min(1, 'projectId is required'),
  boardId: z
    .string({ required_error: 'boardId is required' })
    .trim()
    .min(1, 'boardId is required'),
  assigneeId: z
    .string({ required_error: 'assigneeId is required' })
    .trim()
    .min(1, 'assigneeId is required'),
  tags: z.array(z.string().trim()).optional().default([]),
  attachments: z.array(z.string().trim()).optional().default([]),
});

export const listBoardTasksSchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().optional().default(20),
  status: z.enum(['todo', 'in_progress', 'done']).optional(),
  assigneeId: z.string().trim().optional(),
});

export const updateTaskSchema = z.object({
  title: z.string().trim().min(1, 'title cannot be empty').optional(),
  description: z.string().trim().optional(),
  status: z.enum(['todo', 'in_progress', 'done'], {
    invalid_type_error: 'status must be todo, in_progress, or done',
  }).optional(),
  assigneeId: z.string().trim().min(1, 'assigneeId cannot be empty').optional(),
  tags: z.array(z.string().trim()).optional(),
  attachments: z.array(z.string().trim()).optional(),
});


