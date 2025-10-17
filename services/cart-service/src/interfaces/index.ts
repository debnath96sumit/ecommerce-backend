import { Request } from "express";
import { Types } from "mongoose";

export * from './cart.interface';

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