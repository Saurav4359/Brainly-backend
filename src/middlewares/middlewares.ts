import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

const jwt_key = "rwqegwerg54";

export function userMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): asserts req is Request & { userId: string } {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({ message: "Missing authorization header" });
    return;
  }

  try {
    const decoded = jwt.verify(authHeader, jwt_key) as { id: string };

    req.userId = decoded.id;  
    next();
  } catch {
    res.status(401).json({ message: "Invalid or expired token" });
  }
}