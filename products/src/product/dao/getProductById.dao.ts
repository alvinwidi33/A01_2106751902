import { db } from "@src/db";
import { eq, and } from "drizzle-orm";
import { products } from "@db/schema/products";
import { categories } from "@db/schema/categories";

export const getProductById = async (tenantId: string, id: string) => {
    const result = await db
        .select()
        .from(products)
        .innerJoin(categories, eq(products.category_id, categories.id)) 
        .where(
            and(
                eq(products.tenant_id, tenantId), 
                eq(products.id, id) 
            )
        );

    return result?.[0]; 
};
