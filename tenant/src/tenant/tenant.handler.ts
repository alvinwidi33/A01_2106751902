import { Request, Response } from "express";
import * as Service from "./services";

export const getTenantHandler = async (req: Request, res: Response) => {
    try {
        const tenant_id = req.params.tenant_id;
        const token = req.headers.authorization?.split(" ")[1]; 

        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const response = await Service.getTenantService(tenant_id, token);
        return res.status(response.status).json(response.data);
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error", error });
    }
};


export const createTenantHandler = async (req: Request, res: Response) => {
  const { name, user } = req.body;
  const response = await Service.createTenantService(user?.user.id, name);
  return res.status(response.status).send(response.data);
}

export const editTenantHandler = async (req: Request, res: Response) => {
  const { old_tenant_id } = req.params;
  const { user, tenant_id, owner_id, name } = req.body;
  const response = await Service.editTenantService(old_tenant_id, user?.user.id, tenant_id, owner_id, name);
  return res.status(response.status).send(response.data);
}

export const deleteTenantHandler = async (req: Request, res: Response) => {
  const { user, tenant_id } = req.body;
  const response = await Service.deleteTenantService(user?.user.id, tenant_id);
  return res.status(response.status).send(response.data);
}