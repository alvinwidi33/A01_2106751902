import { InternalServerErrorResponse, NotFoundResponse, UnauthorizedResponse } from "@src/commons/patterns";
import { getOrderById } from "../dao/getOrderById.dao";
import { getOrderDetail } from "../dao/getOrderDetail.dao";
import { User } from "@src/shared/types";
import axios from "axios";

export const getOrderDetailService = async (
    token:String,
    order_id: string,
) => {
    try {
        const SERVER_TENANT_ID = process.env.TENANT_ID;
        if (!SERVER_TENANT_ID) {
            throw new Error("SERVER_TENANT_ID is not defined");
        }

        const authResponse = await axios.post(
            `http://localhost:8888/api/auth/verify-token`,
            { token },
            {
              headers: { 
                "Content-Type": "application/json",
              }, 
            }
        );
        if (!authResponse.data?.user?.id) {
            throw new Error("Invalid token response: Missing owner ID");
        }
        if (!order_id) {
            return new InternalServerErrorResponse("Order ID is not defined").generate();
        }

        const orderDetail = await getOrderDetail(SERVER_TENANT_ID, order_id);
        if (!orderDetail) {
            return new NotFoundResponse("Order detail not found").generate();
        }

        const order = await getOrderById(SERVER_TENANT_ID, authResponse.data?.user?.id, orderDetail?.order_id);
        if (!order) {
            return new NotFoundResponse("Order not found").generate();
        }
        if (order.user_id !== authResponse.data?.user?.id) {
            return new UnauthorizedResponse("User is not authorized").generate();
        }

        return {
            data: {
                id:orderDetail.id,
                tenant_id:orderDetail.tenant_id,
                order_id:{
                    id:order.id,
                    tenant_id:order.tenant_id,
                    user_id:authResponse.data.user,
                    order_date:order.order_date,
                    total_amount:order.total_amount,
                    shipping_provide:order.shipping_provider,
                    shipping_code:order.shipping_code,
                    shipping_status:order.shipping_status
                },
                product_id:orderDetail.product_id,
                quantity:orderDetail.quantity,
                unit_price:orderDetail.unit_price
            },
            status: 200,
        }
    } catch (err: any) {
        return new InternalServerErrorResponse(err).generate();
    }
}