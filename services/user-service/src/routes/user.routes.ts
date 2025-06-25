import express, {Request, Response, NextFunction} from 'express';
import UserController from '../controllers/user.controller';
import WishlistController from '../controllers/wishlist.controller';
import { verifyTokenWithRole } from '../middleware/auth.middleware';
import { validate, validateRefreshToken } from '../middleware/validate';
import { loginSchema } from '../validations/user.validation';

const router = express.Router();

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