import { db } from "@src/db";
import { eq } from "drizzle-orm";
import { products } from "@db/schema/products";
import { categories } from "@db/schema/categories";

export const getAllProductsByTenantId = async (tenantId: string) => {
    const result = await db
        .select()
        .from(products)
        .innerJoin(categories, eq(products.category_id, categories.id)) 
        .where(eq(products.tenant_id, tenantId));
    return result;
};