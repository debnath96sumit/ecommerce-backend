import express, {Request, Response, NextFunction} from 'express';
import UserController from '../controllers/user.controller';
import WishlistController from '../controllers/wishlist.controller';
import { verifyTokenWithRole } from '../middleware/auth.middleware';
import { validate, validateRefreshToken } from '../middleware/validate';
import { loginSchema } from '../validations/user.validation';

const router = express.Router();

/**
 * @openapi
 * /register:
 *   post:
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - role
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               role:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Validation error
 */
router.post('/register', UserController.createUser);

/**
 * @openapi
 * /login:
 *   post:
 *     summary: Login of a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       400:
 *         description: Validation error
 */
router.post('/login', validate(loginSchema),  UserController.login);

/**
 * @openapi
 * /google-signin:
 *   post:
 *     summary: Google sign-in API
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *             properties:
 *               token:
 *                 type: string
 *     responses:
 *       201:
 *         description: User logged in successfully
 *       400:
 *         description: Validation error
 */
router.post('/google-signin',  UserController.googleSignIn);

/**
 * @openapi
 * /refresh-token:
 *   post:
 *     summary: Refresh token API
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: User token fetched successfully
 *       400:
 *         description: Validation error
 */
router.post('/refresh-token', validateRefreshToken , UserController.refreshToken);

/**
 * @openapi
 * /logout:
 *   post:
 *     summary: Logout API
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Logged out successfully
 *       400:
 *         description: Validation error
 */
router.post('/logout', UserController.logout);

/**
 * @openapi
 * /getProfile:
 *   get:
 *     summary: Get logged-in user profile
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved user profile
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "64f8e2d3a0a7a4b2c8a3c1d1"
 *                 name:
 *                   type: string
 *                   example: "John Doe"
 *                 email:
 *                   type: string
 *                   example: "john@example.com"
 *                 role:
 *                   type: string
 *                   example: "user"
 *       401:
 *         description: Unauthorized - Missing or invalid token
 */
router.get('/getProfile', verifyTokenWithRole(), UserController.getProfile);

/**
 * @openapi
 * /my-wishlist:
 *   get:
 *     summary: Get logged-in user wishlist
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
router.get('/my-wishlist', verifyTokenWithRole(['customer']), WishlistController.getMyWishlist);

/**
 * @openapi
 * /add-to-wishlist:
 *   post:
 *     summary: Add product to wishlist
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *             properties:
 *               productId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successfully added product to wishlist
 *       400:
 *         description: Validation error
 */
router.post('/add-to-wishlist', verifyTokenWithRole(['customer']), WishlistController.addToWishlist);

/**
 * @openapi
 * /remove-from-wishlist:
 *   post:
 *     summary: Remove product from wishlist
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *             properties:
 *               productId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successfully removed product from wishlist
 *       400:
 *         description: Validation error
 */
router.post('/remove-from-wishlist', verifyTokenWithRole(['customer']), WishlistController.removeFromWishlist);

export default router;