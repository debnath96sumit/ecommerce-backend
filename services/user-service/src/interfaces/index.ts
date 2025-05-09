import { IUser } from "./user.interface";
import { Request } from "express";

export interface AuthenticatedRequest extends Request {
    user?: IUser
}