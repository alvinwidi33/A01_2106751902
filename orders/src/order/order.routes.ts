import express from 'express';
import { validate, verifyJWT } from "@src/middleware";
import * as Validation from './validation';
import * as Handler from './order.handler';

const router = express.Router();
/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Get all orders
 *     description: Retrieves a list of all orders in the system.
 *     tags:
 *       - Orders
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved orders
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 orders:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         format: uuid
 *                         example: "218419ff-7419-40ec-9df7-abfec1f5be1e"
 *                       tenant_id:
 *                         type: string
 *                         format: uuid
 *                         example: "47dd6b24-0b23-46b0-a662-776158d089ba"
 *                       user_id:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             format: uuid
 *                             example: "92d3de1d-ab71-4b3a-918d-50b55587e781"
 *                           username:
 *                             type: string
 *                             example: "bubu"
 *                           email:
 *                             type: string
 *                             example: "bubu@gmail.com"
 *                           full_name:
 *                             type: string
 *                             example: "bubu"
 *                           address:
 *                             type: string
 *                             example: "jl.bubu"
 *                           phone_number:
 *                             type: string
 *                             example: "00"
 *                       order_date:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-03-27T08:26:15.573Z"
 *                       total_amount:
 *                         type: number
 *                         example: 100
 *                       shipping_provide:
 *                         type: string
 *                         example: "JNE"
 *                       shipping_code:
 *                         type: string
 *                         nullable: true
 *                         example: null
 *                       shipping_status:
 *                         type: string
 *                         nullable: true
 *                         example: null
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get('', verifyJWT, Handler.getAllOrdersHandler);
router.get('/:orderId', verifyJWT, validate(Validation.getOrderDetailSchema), Handler.getOrderDetailHandler);
router.post('', verifyJWT, validate(Validation.placeOrderSchema), Handler.placeOrderHandler);
router.post('/:orderId/pay', validate(Validation.payOrderSchema), Handler.payOrderHandler);
router.post('/:orderId/cancel', verifyJWT, validate(Validation.cancelOrderSchema), Handler.cancelOrderHandler);

export default router;