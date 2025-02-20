import { InternalServerErrorResponse, NotFoundResponse } from "@src/commons/patterns";
import { getTenantById } from "../dao/getTenantById.dao";
import axios from "axios";

export const getTenantService = async (tenant_id: string, token: string) => {
    try {
        const tenant = await getTenantById(tenant_id);
        if (!tenant) {
            return new NotFoundResponse("Tenant not found").generate();
        }
        const authResponse = await axios.post(
            `http://localhost:8888/api/auth/verify-admin-token`,
            { token },
            {
              headers: { 
                "Content-Type": "application/json",
              }, 
            }
        );        
          
        const owner_id = authResponse.data?.user?.id;

        if (!owner_id) {
            throw new Error("Invalid token response: Missing owner ID");
        }

        return {
            data: {
                tenants: {
                    id: tenant.tenants.id,
                    owner_id: authResponse.data?.user,
                },
                tenantDetails: {
                    id: tenant.tenantDetails.id,
                    tenant_id: tenant.tenantDetails.tenant_id,
                    name: tenant.tenantDetails.name,
                },
            },
            status: 200,
        };
    } catch (error: any) {

        return new InternalServerErrorResponse("Authentication failed").generate();
    }
    
};
