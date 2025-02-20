import { InternalServerErrorResponse } from "@src/commons/patterns"
import { getAllProductsByTenantId } from "../dao/getAllProductsByTenantId.dao";

export const getAllProductsService = async () => {
    try {
        const SERVER_TENANT_ID = process.env.TENANT_ID;
        if (!SERVER_TENANT_ID) {
            return new InternalServerErrorResponse('Server Tenant ID not found').generate()
        }

        const products = await getAllProductsByTenantId(SERVER_TENANT_ID);
        return {
            data: {
                products: products.map((item) => ({
                    id: item.products.id,
                    tenant_id:item.products.tenant_id,
                    name: item.products.name,
                    description:item.products.description,
                    price:item.products.price,
                    quantoty_available:item.products.quantity_available,
                    category_id:item.categories
                })),
            },
            status: 200
        }
    } catch (err: any) {
        return new InternalServerErrorResponse(err).generate()
    }
}