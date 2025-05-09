import express from 'express';
import UserController from '../controllers/user.controller';
import { verifyToken } from '../middleware/auth.middleware';

const router = express.Router();

router.post('/register', UserController.createUser);
router.post('/login', UserController.login);
router.post('/refresh-token', UserController.refreshToken);
router.post('/logout', UserController.logout);
router.get('/getProfile', verifyToken, UserController.getProfile);

export default router;