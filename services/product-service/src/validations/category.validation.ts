import { z } from 'zod';

export const categoryCreateSchema = z.object({
  name: z.string().min(1, { message: "Category name is required" }),
  description: z.string().optional(),
  image: z.string().url({ message: "Image must be a valid URL" }).optional(),
  parent: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, { message: "Invalid parent category ID" })
    .optional(),
});