import mongoose, { Schema } from 'mongoose';
import { IUser } from "../interfaces/user.interface";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from "../config";
import { Role } from './Role';
import { IRole } from '../interfaces/role.interface';

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: mongoose.Schema.Types.ObjectId, ref: Role, required: true },
    password: { type: String, required: true },
    refreshToken: { type: String, default: null },
    refreshTokenExpiry: { type: Date, default: null },
  },
  { timestamps: true, versionKey:false }
);

UserSchema.pre('save', async function(next){
  if (!this.isModified('password')) return next();
  try {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (error) {
    next(error as Error);
  }
})

UserSchema.methods.matchPassword = async function(enteredPass: string){
  return bcrypt.compare(enteredPass, this.password)
}

UserSchema.methods.generateRefreshToken = async function() {
  const refreshToken = jwt.sign(
    { id: this._id },
    JWT_SECRET,
    { expiresIn: '7d' } // Refresh token expires in 7 days
  );
  this.refreshToken = refreshToken;
  this.refreshTokenExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  await this.save();
  return refreshToken;
}

//get Role
UserSchema.methods.getRole = async function(): Promise<IRole | null> {
  const role = await Role.findById(this.role).exec();
  return role;
}
UserSchema.methods.invalidateRefreshToken = async function() {
  this.refreshToken = undefined;
  this.refreshTokenExpiry = undefined;
  await this.save();
}

export const User = mongoose.model<IUser>('User', UserSchema);
