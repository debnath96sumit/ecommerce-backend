import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config';

export const verifyTokenWithRole = (allowedRoles: string[] = []) => {
  return (req: any, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      res.status(401).json({ message: 'Not authenticated' });
      return;
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      req.user = decoded;

      if (allowedRoles.length > 0) {
        const userRole = decoded.role?.name;
        if (!userRole || !allowedRoles.includes(userRole)) {
          res.status(403).json({ message: 'Not authorized' });
          return;
        }
      }

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Token invalid' });
      return;
    }
  };
};
