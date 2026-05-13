import z from 'zod';

export const emailValidation = z.email().transform((email) => email.toLowerCase());
