import { Request, Response, NextFunction } from "express";
import axios from "axios";
import { UnauthenticatedResponse } from "../commons/patterns/exceptions";

export const verifyJWTTenant = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split("Bearer ")[1];
    if (!token) {
      return res.status(401).send({ message: "Invalid token" });
    }

    const userServiceURL = "http://localhost:8888/auth/verify-admin-token";

    const userResponse = await axios.post(userServiceURL, { token });

    if (userResponse.status !== 200 || !userResponse.data?.user) {
      return res.status(401).send({ message: "Invalid token" });
    }

    const user = userResponse.data.user;

    const { tenant_id } = req.params;
    if (!tenant_id) {
      return res.status(400).send({ message: "Tenant ID is required" });
    }

    req.body.user = { ...user, tenant_id };

    next();
  } catch (error) {
    return res.status(401).json(
      new UnauthenticatedResponse("Invalid token").generate()
    );
  }
};
