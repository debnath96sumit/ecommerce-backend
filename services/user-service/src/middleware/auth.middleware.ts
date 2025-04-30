import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from "../config";

export const verifyToken = (req: any, res: Response, next: NextFunction) =>{
    let token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({message: 'Not authorized'});

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as any;
        req.user = decoded;
        next();
    } catch (error) {
        console.log(error);
        return res.status(401).json({message: 'Token invalid'});
    }
}