import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import axios from "axios";
import { UnauthenticatedResponse } from "../commons/patterns/exceptions";

interface JWTUser extends JwtPayload {
  id: string;
  tenant_id: string;
}

export const verifyJWTTenant = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split("Bearer ")[1];
    if (!token) {
      return res.status(401).send({ message: "Invalid token 10" });
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

    // Verifikasi user melalui API lain (port 8888)
    const userResponse = await axios.get(
      `http://localhost:8888/api/auth/verify-admin-token`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (userResponse.status !== 200) {
      return res.status(401).send({ message: "User verification failed" });
    }

    const tenantResponse = await axios.get(
      `http://localhost:8891/api/tenant/${SERVER_TENANT_ID}`
    );

    if (tenantResponse.status !== 200) {
      return res.status(401).send({ message: "Tenant verification failed" });
    }

    req.body.user = userResponse.data;
    next();
  } catch (error) {
    return res.status(401).json(
      new UnauthenticatedResponse("Invalid token1").generate()
    );
  }
};
