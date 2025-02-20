import { InternalServerErrorResponse, NotFoundResponse, UnauthorizedResponse } from "@src/commons/patterns"
import { deleteTenantById } from "../dao/deleteTenantById.dao";
import { getTenantById } from "../dao/getTenantById.dao";

export const deleteTenantService = async (
    user_id: String,
    tenant_id: string
) => {
    try {
        const tenant_information = await getTenantById(tenant_id);
        if (!tenant_information) {
            return new NotFoundResponse('Tenant not found').generate()
        }

        if (tenant_information.tenants.owner_id !== user_id) {
            return new UnauthorizedResponse('You are not allowed to delete this tenant').generate()
        }

        const tenant = await deleteTenantById(tenant_id);
        if (!tenant) {
            return new NotFoundResponse('Tenant not found').generate()
        }

        return {
            data: {
                ...tenant
            },
            status: 200,
        }
    } catch (err: any) {
        return new InternalServerErrorResponse(err).generate()
    }
}