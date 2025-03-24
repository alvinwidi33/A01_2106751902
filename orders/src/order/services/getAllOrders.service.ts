import { InternalServerErrorResponse } from "@src/commons/patterns";
import { getAllOrders } from "../dao/getAllOrders.dao";
import { User } from "@src/shared/types";
import axios from "axios";

export const getAllOrdersService = async (
    user: User,
    token: String
) => {
    try {
        const SERVER_TENANT_ID = process.env.TENANT_ID;
        if (!SERVER_TENANT_ID) {
            throw new Error("SERVER_TENANT_ID is not defined");
        }
        const authResponse = await axios.post(
            `${process.env.AUTH_MS_URL}/api/auth/verify-token`,
            { token },
            {
              headers: { 
                "Content-Type": "application/json",
              }, 
            }
        );

        const orders = await getAllOrders(SERVER_TENANT_ID, authResponse.data.user?.id);

        return {
            data: {
                orders : orders.map((order) => ({
                    id:order.id,
                    tenant_id:order.tenant_id,
                    user_id:authResponse.data.user,
                    order_date:order.order_date,
                    total_amount:order.total_amount,
                    shipping_provide:order.shipping_provider,
                    shipping_code:order.shipping_code,
                    shipping_status:order.shipping_status
                }))
            },
            status: 200,
        }
    } catch (err: any) {
        return new InternalServerErrorResponse(err).generate();
    }
}