import express from 'express';
import CategoryController from '../controllers/category.controller';
import { verifyTokenWithRole } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate';
import { categoryCreateSchema } from '../validations';

const router = express.Router();

/**
 * @openapi
 * /category/add:
 *   post:
 *     summary: Create a new category
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 1
 *                 description: Category name
 *               description:
 *                 type: string
 *                 description: Category description
 *               image:
 *                 type: string
 *                 format: url
 *                 description: Category image URL
 *               parent:
 *                 type: string
 *                 pattern: ^[0-9a-fA-F]{24}$
 *                 description: Parent category ID
 *     responses:
 *       201:
 *         description: Category created successfully
 *       400:
 *         description: Validation error
 */
router.post('/add', verifyTokenWithRole(['admin']), validate(categoryCreateSchema),  CategoryController.addCategory );

/**
 * @openapi
 * /category/get-all:
 *   get:
 *     summary: Get all categories
 *     responses:
 *       200:
 *         description: Successfully retrieved categories
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 categories:
 *                   type: array
 *       404:
 *         description: No categories found
 */
router.get('/get-all', CategoryController.getAllCategories);

export default router;