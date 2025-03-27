import express from "express";
import { validate } from "@src/middleware/validate";
import * as Validation from "./validation";
import * as Handler from "./user.handler";

const router = express.Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     description: Creates a new user account.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 format: username
 *                 example: "bubu"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "bubu@gmail.com"
 *               address:
 *                  type: string
 *                  example: "jl.bubu"
 *               phone_number:
 *                  type: string
 *                  example: "00"
 *               full_name:
 *                 type: string
 *                 example: "bubu"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "Bubububu3"
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User registered successfully"
 *       400:
 *         description: Bad request (validation failed)
 */
router.post("/register", validate(Validation.registerSchema), Handler.registerHandler);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: User login
 *     description: Authenticates a user and returns a JWT token.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 format: username
 *                 example: "bubu"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "Bubububu3"
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR..."
 *       400:
 *          description: Bad Request
 *       404:
 *         description: Invalid Password
 */
router.post("/login", validate(Validation.loginSchema), Handler.loginHandler);
/**
 * @swagger
 * /api/verify-token:
 *   post:
 *     summary: Verify JWT token
 *     description: Verifies if the provided JWT token is valid.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 description: JWT token to be verified
 *                 example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImY4N2RjM2JkLWE2OGEtNGE4NS1iNTQwLWI2NjBmNjFhNmYyOCIsInRlbmFudF9pZCI6IjQ3ZGQ2YjI0LTBiMjMtNDZiMC1hNjYyLTc3NjE1OGQwODliYSIsImlhdCI6MTc0MDAyNDgyNiwiZXhwIjoxNzQwMTExMjI2fQ.nR1H7BRONdimby2n7tZkrTXJ55uwSS07dmkFG7ALXdU"
 *     responses:
 *       200:
 *         description: Token is valid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 valid:
 *                   type: boolean
 *                   example: true
 *                 user_id:
 *                   type: string
 *                   format: uuid
 *                   example: "f87dc3bd-a68a-4a85-b540-b660f61a6f28"
 *                 tenant_id:
 *                   type: string
 *                   format: uuid
 *                   example: "47dd6b24-0b23-46b0-a662-776158d089ba"
 *       400:
 *         description: Bad Request
 *       403:
 *         description: Invalid Token
 *       500:
 *         description: Internal server error
 */
router.post("/verify-token", validate(Validation.verifyTokenSchema), Handler.verifyTokenHandler);
router.post("/verify-admin-token", validate(Validation.verifyAdminTokenSchema), Handler.verifyAdminTokenHandler);

export default router;

