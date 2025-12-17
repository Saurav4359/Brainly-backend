import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
const jwt_key="rwqegwerg54";
export const userMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const header= req.headers["authorization"];
  const decode=jwt.verify(header as string,jwt_key);
  if(decode){
    //@ts-ignore
    req.userId=decode.id;
     next();
  }
  else{
    return res.status(403).json({
        message :"You are not logged in!",
    })
  }
};

