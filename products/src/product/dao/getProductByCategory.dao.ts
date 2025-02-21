import { db } from "@src/db";
import { eq, and } from "drizzle-orm";
import { products } from "@db/schema/products";
import { categories } from "@db/schema/categories";

export const getProductByCategory = async (tenantId: string, category_id: string) => {
    const result = await db
        .select()
        .from(products)
        .innerJoin(categories, eq(products.category_id, categories.id)) 
        .where(
            and(
                eq(products.tenant_id, tenantId),
                eq(products.category_id, category_id)
            )
        )
    return result;
}