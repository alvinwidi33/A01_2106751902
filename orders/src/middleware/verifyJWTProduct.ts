import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import axios from "axios";
import { UnauthenticatedResponse } from "../commons/patterns/exceptions";

interface JWTUser extends JwtPayload {
  id: string;
  tenant_id: string;
}

export const verifyJWTProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split("Bearer ")[1];
    if (!token) {
      return res.status(401).send({ message: "Invalid token 9" });
    }
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as JWTUser;

    const { tenant_id, id } = decoded;


    const SERVER_TENANT_ID = process.env.TENANT_ID;
    if (!SERVER_TENANT_ID || tenant_id !== SERVER_TENANT_ID) {
      return res.status(401).send({ message: "Invalid tenant" });
    }

    const userResponse = await axios.post(
      `http://localhost:8888/api/auth/verify-token`,
      { token }, 
      {
        headers: { "Content-Type": "application/json" }, 
      }
    );    
    if (userResponse.status !== 200) {
      return res.status(401).send({ message: "User verification failed" });
    }
    const tenantResponse = await axios.get(
      `http://localhost:8891/api/tenant/${req.body.tenant_id}`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    if (tenantResponse.status !== 200) {
      return res.status(401).send({ message: "Tenant verification failed" });
    }

    const tenantData = tenantResponse.data;
    if (tenantData.owner_id !== userResponse.data.id) {
      return res.status(401).send({ message: "User is not the tenant owner" });
    }

    req.body.user = userResponse.data;
    next();
  } catch (error) {
    return res.status(401).json(
      new UnauthenticatedResponse("Invalid token 2").generate()
    );
  }
};
