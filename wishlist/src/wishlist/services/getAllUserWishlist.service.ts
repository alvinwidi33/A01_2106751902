import { InternalServerErrorResponse, NotFoundResponse } from "@src/commons/patterns";
import { getAllUserWishlist } from "../dao/getAllUserWishlist.dao";
import { User } from "@src/shared/types";
import axios from "axios";

export const getAllUserWishlistService = async (
    user: User,
    token : String
) => {
    try {
        const SERVER_TENANT_ID = process.env.TENANT_ID;
        if (!SERVER_TENANT_ID) {
            return new InternalServerErrorResponse('Server tenant ID is missing').generate();
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

        const wishlists = await getAllUserWishlist(SERVER_TENANT_ID, authResponse.data.user?.id);
        
        return {
            data: {
                wishlists: wishlists.map((item) =>({
                    id:item.id,
                    tenant_id:item.tenant_id,
                    user_id:authResponse.data.user,
                    name:item.name
                }))
            },
            status: 200,
        };
    } catch (err: any) {
        return new InternalServerErrorResponse(err).generate();
    }
}