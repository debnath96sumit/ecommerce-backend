import { ZodSchema } from 'zod';
import { Request, Response, NextFunction } from 'express';

export const validate = (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
        res.status(400).json({messsage: 'Validation failed', errors: result.error.flatten().fieldErrors });
        return;
    }
    req.body = result.data;
    next();
};

export const validateRefreshToken = (req: Request, res: Response, next: NextFunction) => {
    const { refreshToken } = req.body;
  
    if (!refreshToken) {
        res.status(400).json({ message: 'refreshToken is required in the request body.' });
        return;
    }
  
    next(); // Go to the controller if everything is fine
};