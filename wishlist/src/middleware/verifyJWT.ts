import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import axios from "axios";
import { UnauthenticatedResponse } from "../commons/patterns/exceptions";

interface JWTUser extends JwtPayload {
    id: string;
    tenant_id: string;
}

export const verifyJWT = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const token = req.headers.authorization?.split("Bearer ")[1];
        if (!token) {
            return res.status(401).json(
                new UnauthenticatedResponse("No token provided").generate()
            );
        }

        const verifyTokenResponse = await axios.post(
            "http://localhost:8888/api/auth/verify-token", 
            { token },
            { headers: { Authorization: `Bearer ${token}` } }
        );

        if (verifyTokenResponse.status !== 200) {
            return res.status(401).json(
                new UnauthenticatedResponse("Invalid token").generate()
            );
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JWTUser;

        // const SERVER_TENANT_ID = process.env.TENANT_ID;
        // if (SERVER_TENANT_ID && decoded.tenant_id !== SERVER_TENANT_ID) {
        //     return res.status(401).json(
        //         new UnauthenticatedResponse("Invalid tenant").generate()
        //     );
        // }

        // const tenantResponse = await axios.get(
        //     `http://localhost:8891/api/tenant/${decoded.tenant_id}`
        // );

        // if (tenantResponse.status !== 200) {
        //     return res.status(401).json(
        //         new UnauthenticatedResponse("Tenant verification failed").generate()
        //     );
        // }

        req.body.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json(
            new UnauthenticatedResponse("Invalid token").generate()
        );
    }
};
