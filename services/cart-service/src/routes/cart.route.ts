import express from 'express';
import CartController from '../controllers/cart.controller';
import { verifyTokenWithRole } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate';
import { cartSchema } from '../validations/cart.validation';

const router = express.Router();

/**
 * @openapi
 * /cart/add:
 *   post:
 *     summary: Create a new cart or add item to existing cart
 *     description: Create a new cart or add item to existing cart (Customer only)
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - User Cart
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Item added to cart successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       403:
 *         description: Forbidden - User doesn't have customer role
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
router.post(
  '/cart/add',
  verifyTokenWithRole(['customer']),
  validate(cartSchema),
  CartController.addToCart
);
export default router;