import mongoose, { Schema } from 'mongoose';
import { IUser } from "../interfaces/user.interface";
import bcrypt from "bcryptjs";
const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: mongoose.Schema.Types.ObjectId, ref: 'Role', required: true },
    password: { type: String, required: true },
    refreshToken: { type: String, default: null },
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
const User = mongoose.model<IUser>('User', UserSchema);
export default User;
