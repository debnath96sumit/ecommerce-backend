import express from 'express';
import ProductController from '../controllers/product.controller';
import { verifyToken } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate';
import { productSchema } from '../validations/product.validation';

const router = express.Router();

router.post('/add', verifyToken, validate(productSchema),  ProductController.addProduct );

export default router;