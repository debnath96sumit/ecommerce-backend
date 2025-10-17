import { z } from 'zod';

export const cartItemSchema = z.object({
  productId: z.string().min(1, { message: 'Product ID is required' }),
  quantity: z
    .number({ invalid_type_error: 'Quantity must be a number' })
    .int()
    .positive({ message: 'Quantity must be at least 1' }),
  price: z
    .number({ invalid_type_error: 'Price must be a number' })
    .positive({ message: 'Price must be greater than 0' }),
});

export const cartSchema = z.object({
  userId: z.string().min(1, { message: 'User ID is required' }),
  items: z.array(cartItemSchema).nonempty({ message: 'Cart must have at least one item' }),
  totalPrice: z
    .number({ invalid_type_error: 'Total price must be a number' })
    .nonnegative({ message: 'Total price cannot be negative' })
    .default(0),
  status: z.enum(['Active', 'Ordered', 'Abandoned']).default('Active'),
});

export type Cart = z.infer<typeof cartSchema>;
export type CartItem = z.infer<typeof cartItemSchema>;
