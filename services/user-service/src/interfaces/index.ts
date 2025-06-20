import { Request } from "express";
import { Types } from "mongoose";
export * from "./user.interface";
export * from "./role.interface";
export * from './wishlist.interface';
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