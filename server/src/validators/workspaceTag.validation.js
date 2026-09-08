import { z } from 'zod';

const hexColorRegex =
  /^#?(?:[\da-f]{3}|[\da-f]{6}|[\da-f]{8})$/i;

export const createWorkspaceTagSchema = z.object({
  name: z
    .string({
      required_error: 'Name is required.',
    })
    .trim()
    .min(1, 'Name is required.'),

  color: z
    .string({
      required_error: 'Color is required.',
    })
    .trim()
    .min(1, 'Color is required.')
    .regex(
      hexColorRegex,
      'Color must be a hexadecimal color value.',
    ),
});