import { z } from 'zod';

export const productSchema = z.object({
  name: z.string().min(1, { message: "Product name is required" }),
  description: z.string().optional(),
  price: z
    .number({ invalid_type_error: 'Price must be a number' })
    .positive({ message: 'Price must be greater than 0' }),
  category: z.string().min(1, { message: "Category is required" }),
  image: z.string().url({ message: "Invalid image URL" }).optional(),
  stock: z
    .number({ invalid_type_error: 'Stock must be a number' })
    .int()
    .nonnegative({ message: 'Stock cannot be negative' }),
  isFeatured: z.boolean().optional(),
  status: z.enum(['Active', 'Inactive']).default('Active'),
});