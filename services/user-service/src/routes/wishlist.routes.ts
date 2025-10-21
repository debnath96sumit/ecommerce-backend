
import express from 'express';
import WishlistController from '../controllers/wishlist.controller';
import { verifyTokenWithRole } from '../middleware/auth.middleware';
const router = express.Router();

/**
 * @openapi
 * /wishlist/list:
 *   get:
 *     summary: Get logged-in user wishlist
 *     tags:
 *       - Wishlist
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved user wishlist
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
router.get('/list', verifyTokenWithRole(['customer']), WishlistController.getMyWishlist);

/**
 * @openapi
 * /wishlist/add:
 *   post:
 *     summary: Add product to wishlist
 *     tags:
 *       - Wishlist
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - product_id
 *             properties:
 *               product_id:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successfully added product to wishlist
 *       400:
 *         description: Validation error
 */
router.post('/add', verifyTokenWithRole(['customer']), WishlistController.addToWishlist);

/**
 * @openapi
 * /wishlist/remove:
 *   post:
 *     summary: Remove product from wishlist
 *     tags:
 *       - Wishlist
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - product_id
 *             properties:
 *               product_id:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successfully removed product from wishlist
 *       400:
 *         description: Validation error
 */
router.post('/remove', verifyTokenWithRole(['customer']), WishlistController.removeFromWishlist);

export default router;