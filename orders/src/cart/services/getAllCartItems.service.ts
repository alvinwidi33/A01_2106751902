import { InternalServerErrorResponse, NotFoundResponse } from "@src/commons/patterns";
import { getAllCartItems } from "../dao/getAllCartItems.dao";
import { User } from "@src/shared/types";
import axios from "axios";

export const getAllCartItemsService = async (token: string) => {
    try {
        const SERVER_TENANT_ID = process.env.TENANT_ID;
        if (!SERVER_TENANT_ID) {
            return new InternalServerErrorResponse("Tenant ID not found").generate();
        }

        // Verifikasi token dan dapatkan user ID
        const authResponse = await axios.post(
            `http://localhost:8888/api/auth/verify-token`,
            { token },
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        const userId = authResponse.data.user?.id;
        if (!userId) {
            return new InternalServerErrorResponse("User not found in token verification").generate();
        }

        const items = await getAllCartItems(SERVER_TENANT_ID, userId);


        const enrichedItems = await Promise.all(
            items.map(async (item) => {
                const productResponse = await axios.get(
                    `http://localhost:8890/api/products/${item.product_id}`
                );
                return {
                    id: item.id,
                    tenant_id: item.tenant_id,
                    user_id: authResponse.data.user, 
                    product: productResponse.data, 
                    quantity: item.quantity,
                }; 
            })
        );

        return {
            data: { items: enrichedItems },
            status: 200,
        };
    } catch (err: any) {
        console.error(err);
        return new InternalServerErrorResponse(err).generate();
    }
};
