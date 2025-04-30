import jwt from "jsonwebtoken";
import { IUser } from "../interfaces/user.interface";
import { JWT_SECRET } from "../config";

export const generateToken = (user: IUser)=>{
    return jwt.sign(
        {
            id: user.id,
            email: user.email,
        },
        JWT_SECRET,
        {
            expiresIn: '1d'
        }

    )
}