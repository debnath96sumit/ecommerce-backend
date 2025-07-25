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
router.post('/login', validate(loginSchema),  UserController.login);
router.post('/google-signin',  UserController.googleSignIn);
router.post('/refresh-token', validateRefreshToken , UserController.refreshToken);
router.post('/logout', UserController.logout);
router.get('/getProfile', verifyTokenWithRole(), UserController.getProfile);
router.get('/my-wishlist', verifyTokenWithRole(['customer']), WishlistController.getMyWishlist);
router.post('/add-to-wishlist', verifyTokenWithRole(['customer']), WishlistController.addToWishlist);
router.post('/remove-from-wishlist', verifyTokenWithRole(['customer']), WishlistController.removeFromWishlist);

export default router;