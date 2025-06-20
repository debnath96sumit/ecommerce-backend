import express from 'express';
import ProductController from '../controllers/product.controller';
import { verifyTokenWithRole } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate';
import { productSchema } from '../validations/product.validation';

const router = express.Router();

router.post('/add', verifyTokenWithRole(['vendor']), validate(productSchema),  ProductController.addProduct );
router.get('/list', ProductController.listProducts );
router.get('/details/:id', ProductController.productDetails );

export default router;