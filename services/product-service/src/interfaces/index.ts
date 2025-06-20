import { Request } from "express";
import { Types } from "mongoose";

export * from './product.interface';
export * from './category.interface';

export interface Role {
    _id: Types.ObjectId;
    name: string;
}
export interface User {
    id: Types.ObjectId;
    name: string;
    email: string;
    role: Role;
}
export interface AuthenticatedRequest extends Request {
    user?: User
}