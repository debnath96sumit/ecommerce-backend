import express from 'express';
import ProductController from '../controllers/product.controller';
import { verifyTokenWithRole } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate';
import { productSchema } from '../validations/product.validation';

const router = express.Router();

/**
 * @openapi
 * /add:
 *   post:
 *     summary: Create a new product
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - category
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 1
 *                 description: Product name
 *               description:
 *                 type: string
 *                 description: Product description
 *               price:
 *                 type: number
 *                 minimum: 0
 *                 exclusiveMinimum: true
 *                 description: Product price
 *               category:
 *                 type: string
 *                 minLength: 1
 *                 description: Category ID
 *               images:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     url:
 *                       type: string
 *                       minLength: 1
 *                       description: Image URL
 *                     alt:
 *                       type: string
 *                       description: Image alt text
 *                     isPrimary:
 *                       type: boolean
 *                       description: Is primary image
 *               stock:
 *                 type: integer
 *                 minimum: 0
 *                 description: Product stock
 *               isFeatured:
 *                 type: boolean
 *                 description: Is featured product
 *               status:
 *                 type: string
 *                 enum:
 *                   - Active
 *                   - Inactive
 *                 default: Active
 *                 description: Product status
 *     responses:
 *       201:
 *         description: Product created successfully
 *       400:
 *         description: Validation error
 */
router.post('/add', verifyTokenWithRole(['vendor']), validate(productSchema),  ProductController.addProduct );
router.get('/list', ProductController.listProducts );
router.get('/details/:id', ProductController.productDetails );

export default router;