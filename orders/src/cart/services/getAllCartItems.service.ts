import { InternalServerErrorResponse, NotFoundResponse } from "@src/commons/patterns";
import { getAllCartItems } from "../dao/getAllCartItems.dao";
import { User } from "@src/shared/types";
import axios from "axios";

export const getAllCartItemsService = async (
    user: User,
    token: String
) => {
    try {
        const SERVER_TENANT_ID = process.env.TENANT_ID;
        if (!SERVER_TENANT_ID) {
            return new InternalServerErrorResponse('Tenant ID not found').generate();
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

        const items = await getAllCartItems(SERVER_TENANT_ID, authResponse.data.user?.id);

        return {
            data: {
                items : items.map((item)=> ({
                    id:item.id,
                    tenant_id:item.tenant_id,
                    user_id:authResponse.data.user,
                    product_id:item.product_id,
                    quantity:item.quantity
                }))
            },
            status: 200,
        }
    } catch (err: any) {
        return new InternalServerErrorResponse(err).generate();
    }
}