import { Request } from "express";
import { IUser } from "./user.interface";
export * from "./user.interface";
export * from "./role.interface";

export interface AuthenticatedRequest extends Request {
    user?: IUser
}