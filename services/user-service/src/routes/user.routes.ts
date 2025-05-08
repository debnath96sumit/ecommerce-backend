import express from 'express';
import UserController from '../controllers/user.controller';

const router = express.Router();

router.post('/register', UserController.createUser);
router.post('/login', UserController.login);
router.post('/refresh-token', UserController.refreshToken);
router.post('/logout', UserController.logout);

export default router;