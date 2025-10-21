import { z } from 'zod';

export const cartItemSchema = z.object({
  product_id: z.string().min(1, { message: 'Product ID is required' }),
  quantity: z
    .number({ invalid_type_error: 'Quantity must be a number' })
    .int()
    .positive({ message: 'Quantity must be at least 1' }),
});

export type CartItem = z.infer<typeof cartItemSchema>;
