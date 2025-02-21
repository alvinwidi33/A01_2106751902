import { InternalServerErrorResponse, NotFoundResponse, UnauthorizedResponse } from "@src/commons/patterns";
import { getWishlistDetailByWishlistId } from "../dao/getWishlistDetailByWishlistId.dao";
import { getWishlistById } from "../dao/getWishlistById.dao";
import { User } from "@src/shared/types";
import axios from "axios";

export const getWishlistByIdService = async (
    wishlist_id: string,
    token: String
) => {
    try {
        const SERVER_TENANT_ID = process.env.TENANT_ID;
        if (!SERVER_TENANT_ID) {
            return new InternalServerErrorResponse('Server tenant ID is missing').generate();
        }

        const wishlistDetail = await getWishlistDetailByWishlistId(wishlist_id);
        if (!wishlistDetail) {
            return new NotFoundResponse('Wishlist is empty').generate();
        }

        const wishlist = await getWishlistById(SERVER_TENANT_ID, wishlist_id);
        if (!wishlist) {
            return new NotFoundResponse('Wishlist not found').generate();
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
        let product;
        try {
            const response = await axios.get(`http://localhost:8890/api/products/${wishlistDetail.product_id}`);
            product = response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return new InternalServerErrorResponse(`Failed to fetch product: ${error.message}`).generate();
            }
            return new InternalServerErrorResponse('An unexpected error occurred while fetching product').generate();
        }

        if (wishlist.user_id !== authResponse.data.user?.id) {
            return new UnauthorizedResponse('User is not authorized to access this wishlist').generate();
        }

        return {
            data: {
                id:wishlistDetail.id,
                wishlist_id: { 
                    id: wishlist.id,
                    name:wishlist.name,
                    tenant_id:wishlist.tenant_id,
                    user_id:authResponse.data?.user
                },
                product_id:product
            },
            status: 200,
        };
    } catch (err: any) {
        return new InternalServerErrorResponse(err).generate();
    }
}