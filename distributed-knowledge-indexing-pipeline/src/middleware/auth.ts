import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

interface JwtPayload {
    userId : string
}

export const authMiddleware = (req : Request, res : Response, next: NextFunction) => {
    const token = req.headers.token;
    if(!token){
        res.status(403).json({
            success : false,
            error : "Token not found"
        });
        return;
    }
    
    try{
        const decodeToken = jwt.verify(token as string, process.env.JWT_SECRET as string) as JwtPayload;
        if(decodeToken){
            req.userId = decodeToken.userId;
            next();
        }
    }
    catch(e){
        console.log(e);
        res.status(500).json({
            success : false,
            error : "Internal Server Error"
        })
    }
}