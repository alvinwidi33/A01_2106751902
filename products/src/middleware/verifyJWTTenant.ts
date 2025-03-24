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
      return res.status(401).send({ message: "Invalid token" });
    }

    const decoded = jwt.verify(
      token,
      process.env.ADMIN_JWT_SECRET!
    ) as JWTUser;

    const { tenant_id, id } = decoded;

    const SERVER_TENANT_ID = process.env.TENANT_ID;
    if (!SERVER_TENANT_ID || tenant_id !== SERVER_TENANT_ID) {
      return res.status(401).send({ message: "Invalid tenant" });
    }

    const userResponse = await axios.post(
      `${process.env.AUTH_MS_URL}/api/auth/verify-admin-token`,
      { token }, 
      {
        headers: { "Content-Type": "application/json" }, 
      }
    );

    req.body.user = userResponse.data;
    next();
  } catch (error) {
    console.error(error)
    return res.status(401).json(
      new UnauthenticatedResponse("Invalid token").generate()
    );
  }
};
