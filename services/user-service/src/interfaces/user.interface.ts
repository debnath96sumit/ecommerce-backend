import mongoose, { Document } from "mongoose";

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
}