import { NextFunction, Request, Response } from "express";
import { verify } from "../utils/jwt";
import { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

export default (req:Request, res:Response, next:NextFunction) => {
  try {
    const { authorization } = req.headers;
    if (!authorization || !authorization.startsWith("Token "))
      throw new Error("token required");
    let [, tokenValue] = authorization.split(" ");

    if (!tokenValue) throw new Error("Invalid token");
    let decodedToken = verify(tokenValue) as JwtPayload;
    req.userId = decodedToken.userId;

    return next();
  } catch (error) {
    res.status(401).json({
      status: 401,
      message: error.message,
    });
  }
};
