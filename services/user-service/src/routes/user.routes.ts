import express, {Request, Response, NextFunction} from 'express';
import UserController from '../controllers/user.controller';
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

export default router;