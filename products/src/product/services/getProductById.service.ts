import { InternalServerErrorResponse } from "@src/commons/patterns"
import { getProductById } from "../dao/getProductById.dao";

export const getProductByIdService = async (
    id: string,
) => {
    try {
        const SERVER_TENANT_ID = process.env.TENANT_ID;
        if (!SERVER_TENANT_ID) {
            return new InternalServerErrorResponse('Server Tenant ID not found').generate()
        }

        const products = await getProductById(SERVER_TENANT_ID, id)

        return {
            data:{
                id: products.products.id,
                tenant_id: products.products.tenant_id,
                name: products.products.name,
                description: products.products.description,
                price: products.products.price,
                quantity_available: products.products.quantity_available,
                category_id: products.categories
            },
            status: 200
        }
    } catch (err: any) {
        return new InternalServerErrorResponse(err).generate()
    }
}