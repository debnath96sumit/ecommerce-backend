import express from 'express';
import CartController from '../controllers/cart.controller';
import { verifyTokenWithRole } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate';
import { cartItemSchema } from '../validations/cart.validation';

const router = express.Router();

/**
 * @openapi
 * /cart/list:
 *   get:
 *     summary: Get logged-in user cart
 *     tags:
 *       - User Cart
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved user cart
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "64f8e2d3a0a7a4b2c8a3c1d1"
 *                 products:
 *                   type: array
 *                   example: ["64f8e2d3a0a7a4b2c8a3c1d1", "64f8e2d3a0a7a4b2c8a3c1d1"]
 *       401:
 *         description: Unauthorized - Missing or invalid token
 */
router.get('/cart/list', verifyTokenWithRole(['customer']), CartController.getMyCart);

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
  *             required:
 *               - product_id
 *               - quantity
 *             properties:
 *               product_id:
 *                 type: string
 *                 pattern: ^[0-9a-fA-F]{24}$
 *                 description: Product ID
 *               quantity:
 *                 type: number
 *                 minimum: 1
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
  validate(cartItemSchema),
  CartController.addToCart
);

/**
 * @openapi
 * /cart/increment/{product_id}:
 *   patch:
 *     summary: Create a new cart or add item to existing cart
 *     description: Create a new cart or add item to existing cart (Customer only)
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - User Cart
 *     parameters:
 *       - in: path
 *         name: product_id
 *         required: true
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
router.patch('/cart/increment/:product_id', verifyTokenWithRole(['customer']), CartController.incrementItem);


/**
 * @openapi
 * /cart/decrement/{product_id}:
 *   patch:
 *     summary: decrement item from cart
 *     description: decrement item from cart
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - User Cart
 *     parameters:
 *       - in: path
 *         name: product_id
 *         required: true
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
router.patch('/cart/decrement/:product_id', verifyTokenWithRole(['customer']), CartController.decrementItem);

/**
 * @openapi
 * /cart/remove/{product_id}:
 *   delete:
 *     summary: delete item from cart
 *     description: delete item from cart
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - User Cart
 *     parameters:
 *       - in: path
 *         name: product_id
 *         required: true
 *     responses:
 *       201:
 *         description: Item removed from cart successfully
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
router.delete('/cart/remove/:product_id', verifyTokenWithRole(['customer']), CartController.removeFromCart);

export default router;