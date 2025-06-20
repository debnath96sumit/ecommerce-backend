import express from 'express';
import CategoryController from '../controllers/category.controller';
import { verifyTokenWithRole } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate';
import { categoryCreateSchema } from '../validations';

const router = express.Router();

router.post('/add', verifyTokenWithRole(['admin']), validate(categoryCreateSchema),  CategoryController.addCategory );
router.get('/get-all', CategoryController.getAllCategories);

export default router;