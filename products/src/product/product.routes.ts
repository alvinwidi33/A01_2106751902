import express from 'express';
import { validate, verifyJWT } from "@src/middleware";
import * as Validation from './validation';
import * as Handler from './product.handler';

const router = express.Router();

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products
 *     description: Retrieve a list of all products.
 *     tags:
 *       - Products
 *     responses:
 *       200:
 *         description: A list of products.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: number
 *                     example: 1
 *                   name:
 *                     type: string
 *                     example: "Product A"
 */
router.get('', Handler.getAllProductsHandler);

/**
 * @swagger
 * /api/products/category:
 *   get:
 *     summary: Get all categories
 *     description: Retrieves a list of all product categories available in the system.
 *     tags:
 *       - Category
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
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         format: uuid
 *                         example: "31de3cfc-3fd7-4e0b-b412-8225f8472c3f"
 *                       name:
 *                         type: string
 *                         example: "fashion"
 *                       tenant_id:
 *                         type: string
 *                         format: uuid
 *                         example: "47dd6b24-0b23-46b0-a662-776158d089ba"
 *       500:
 *         description: Internal server error
 */
router.get('/category', Handler.getAllCategoryHandler);

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get product by ID
 *     description: Retrieve a specific product using its ID.
 *     tags:
 *       - Products
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The UUID of the product to retrieve.
 *     responses:
 *       200:
 *         description: Successfully retrieved the product
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   format: uuid
 *                   example: "31de3cfc-3fd7-4e0b-b412-8225f8472c3f"
 *                 name:
 *                   type: string
 *                   example: "Smartphone"
 *                 price:
 *                   type: number
 *                   example: 999.99
 *                 stock:
 *                   type: integer
 *                   example: 50
 *       400:
 *         description: Invalid ID supplied
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal server error
 */
router.get('/:id', validate(Validation.getProductByIdSchema), Handler.getProductByIdHandler);

router.post('/many', validate(Validation.getManyProductDatasByIdSchema), Handler.getManyProductDatasByIdHandler);
/**
 * @swagger
 * /api/products/category/{category_id}:
 *   get:
 *     summary: Get products by category ID
 *     description: Retrieve a list of products that belong to a specific category.
 *     tags:
 *       - Products
 *     parameters:
 *       - in: path
 *         name: category_id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The UUID of the category.
 *     responses:
 *       200:
 *         description: Successfully retrieved products in the category
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     format: uuid
 *                     example: "31de3cfc-3fd7-4e0b-b412-8225f8472c3f"
 *                   name:
 *                     type: string
 *                     example: "fashion"
 *                   tenant_id:
 *                     type: string
 *                     format: uuid
 *                     example: "47dd6b24-0b23-46b0-a662-776158d089ba"
 *       400:
 *         description: Invalid category ID supplied
 *       404:
 *         description: Category not found
 *       500:
 *         description: Internal server error
 */
router.get('/category/:category_id', validate(Validation.getProductByCategorySchema), Handler.getProductByCategoryHandler);
/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create a new product
 *     description: Adds a new product to the system.
 *     tags:
 *       - Products
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tenant_id:
 *                 type: string
 *                 format: uuid
 *                 example: "ef97916e-3486-4ee5-b426-fb0def312726"
 *               name:
 *                 type: string
 *                 example: "dress 1"
 *               description:
 *                 type: string
 *                 example: "bagus"
 *               price:
 *                 type: number
 *                 example: 100
 *               quantity_available:
 *                 type: integer
 *                 example: 10
 *               category_id:
 *                 type: string
 *                 format: uuid
 *                 example: "fe00914e-2a5f-4052-a064-14133e284dc8"
 *     responses:
 *       201:
 *         description: Product created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   format: uuid
 *                   example: "a3c949f2-50c1-49e1-8e4c-4d3e79bbf3a8"
 *                 tenant_id:
 *                   type: string
 *                   format: uuid
 *                   example: "ef97916e-3486-4ee5-b426-fb0def312726"
 *                 name:
 *                   type: string
 *                   example: "dress 1"
 *                 description:
 *                   type: string
 *                   example: "bagus"
 *                 price:
 *                   type: number
 *                   example: 100
 *                 quantity_available:
 *                   type: integer
 *                   example: 10
 *                 category_id:
 *                   type: string
 *                   format: uuid
 *                   example: "fe00914e-2a5f-4052-a064-14133e284dc8"
 *       400:
 *         description: Bad Request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post('', verifyJWT, validate(Validation.createProductSchema), Handler.createProductHandler);
/**
 * @swagger
 * /api/products/category:
 *   post:
 *     summary: Create a new category
 *     description: |
 *       Endpoint untuk menambahkan kategori baru. 
 *       **Diperlukan token JWT yang valid untuk mengakses endpoint ini.**  
 *       - Klik tombol **Authorize** di Swagger UI.  
 *       - Masukkan token dengan format: `Bearer <your_jwt_token>`.  
 *       - Klik **Authorize**, lalu tutup modal dan coba akses endpoint ini.  
 *     tags:
 *       - Category
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "fashion"
 *               tenant_id:
 *                 type: string
 *                 format: uuid
 *                 example: "020fda62-d1c2-454b-9f6a-6de4ac4683e9"
 *     responses:
 *       201:
 *         description: Category created successfully
 *       400:
 *         description: Bad request (validation error)
 *       401:
 *         description: Unauthorized (invalid or missing token)
 *       500:
 *         description: Internal server error
 */
router.post('/category', verifyJWT, validate(Validation.createCategorySchema), Handler.createCategoryHandler);
router.put('/:id', verifyJWT, validate(Validation.editProductSchema), Handler.editProductHandler);
router.put('/category/:category_id', verifyJWT, validate(Validation.editCategorySchema), Handler.editCategoryHandler);
router.delete('/:id', verifyJWT, validate(Validation.deleteProductSchema), Handler.deleteProductHandler);
router.delete('/category/:category_id', verifyJWT, validate(Validation.deleteCategorySchema), Handler.deleteCategoryHandler);

export default router;