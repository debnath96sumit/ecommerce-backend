import mongoose, { Document } from "mongoose";
import { IRole } from "../interfaces";

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    role: mongoose.Types.ObjectId;
    refreshToken?: string;
    refreshTokenExpiry?: Date;
    matchPassword: (enteredPass: string) => Promise<boolean>;
    generateRefreshToken: () => Promise<string>;
    invalidateRefreshToken: () => Promise<void>;
    getRole: () => Promise<IRole | null>;
}