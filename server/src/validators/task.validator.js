import mongoose from 'mongoose';
import { z } from 'zod';

const objectIdString = z
  .string()
  .trim()
  .refine(
    (value) => mongoose.Types.ObjectId.isValid(value),
    'Must be a valid ObjectId',
  );

export const createTaskSchema = z.object({
  title: z
    .string({ required_error: 'title is required' })
    .trim()
    .min(1, 'title is required'),
  description: z.string().trim().optional().default(''),
  status: z.string({
    required_error: 'status is required',
    invalid_type_error: 'status must be a string',
  }).trim().min(1, 'status is required'),
  priority: z.enum(['lowest', 'low', 'medium', 'high', 'highest'], {
    required_error: 'priority is required',
    invalid_type_error: 'priority must be lowest, low, medium, high, or highest',
  }).optional().default('medium'),
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
  tags: z.array(objectIdString).optional().default([]),
  attachments: z.array(z.string().trim()).optional().default([]),
});

export const listBoardTasksSchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().optional().default(20),
  status: z.string().trim().min(1).optional(),
  assigneeId: z.string().trim().optional(),
});

export const updateTaskSchema = z.object({
  title: z.string().trim().min(1, 'title cannot be empty').optional(),
  description: z.string().trim().optional(),
  status: z.string().trim().min(1, 'status cannot be empty').optional(),
  priority: z.enum(['lowest', 'low', 'medium', 'high', 'highest'], {
    invalid_type_error: 'priority must be lowest, low, medium, high, or highest',
  }).optional(),
  assigneeId: z.string().trim().min(1, 'assigneeId cannot be empty').optional(),
  tags: z.array(objectIdString).optional(),
  attachments: z.array(z.string().trim()).optional(),
});


