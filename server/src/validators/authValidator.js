// Schema validators using zod

import * as z from 'zod';

export const registerUserSchema = z
  .object({
    name: z.string().trim().min(1, 'Name is required'),

    email: z.email('Please provide a valid email').toLowerCase(),

    password: z.string().min(8, 'Password should be at least 8 characters'),

    passwordConfirm: z.string().min(1, 'Confirm your password'),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: 'Please enter the same password',
    path: ['passwordConfirm'],
  });

export const loginUserSchema = z.object({
  email: z.email('Please provide a valid email').toLowerCase(),
  password: z.string().min(1, 'Enter Your Password'),
});
