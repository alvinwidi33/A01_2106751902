import { Request, Response } from "express";
import * as Service from './services';

export const getAllCartItemsHandler = async (req: Request, res: Response) => {
    try {
        const { user } = req.body;
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const response = await Service.getAllCartItemsService(user, token);
        return res.status(response.status).send(response.data);
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error", error });
    }
}

export const addItemToCartHandler = async (req: Request, res: Response) => {
    const { user } = req.body;
    const { product_id, quantity } = req.body;
    const response = await Service.addItemToCartService(user, product_id, quantity);
    return res.status(response.status).send(response.data);
}

export const editCartItemHandler = async (req: Request, res: Response) => {
    const { user } = req.body;
    const { cart_id, quantity } = req.body;
    const response = await Service.editCartItemService(user, cart_id, quantity);
    return res.status(response.status).send(response.data);
}

export const deleteCartItemHandler = async (req: Request, res: Response) => {
    const { user } = req.body;
    const { product_id } = req.body;
    const response = await Service.deleteCartItemService(user, product_id);
    return res.status(response.status).send(response.data);
}