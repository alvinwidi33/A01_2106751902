import { Request, Response } from "express";
import * as Service from "./services";

export const getAllOrdersHandler = async (req: Request, res: Response) => {
    try {
        const { user } = req.body;
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const response = await Service.getAllOrdersService(user, token);
        return res.status(response.status).send(response.data);
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error", error });
    }
}

export const getOrderDetailHandler = async (req: Request, res: Response) => {
    try {
        const { orderId } = req.params;
        const token = req.headers.authorization?.split(" ")[1]; 

        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const response = await Service.getOrderDetailService(token, orderId);
        return res.status(response.status).json(response.data);
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error", error });
    }
}

export const placeOrderHandler = async (req: Request, res: Response) => {
    const { user } = req.body;
    const { shipping_provider } = req.body;
    const response = await Service.placeOrderService(user, shipping_provider);
    return res.status(response.status).send(response.data);
}

export const payOrderHandler = async (req: Request, res: Response) => {
    const { orderId } = req.params;
    const { payment_method, payment_reference, amount } = req.body;
    const response = await Service.payOrderService(orderId, payment_method, payment_reference, amount);
    return res.status(response.status).send(response.data);
}

export const cancelOrderHandler = async (req: Request, res: Response) => {
    const { orderId } = req.params;
    const { user } = req.body;
    const response = await Service.cancelOrderService(user, orderId);
    return res.status(response.status).send(response.data);
}
