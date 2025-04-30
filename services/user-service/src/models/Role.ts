import mongoose, { Schema } from 'mongoose';
import { IRole } from "../interfaces/role.interface";

const RoleSchema = new Schema<IRole>(
  {
    name: { type: String, required: true },
  },
  { timestamps: true, versionKey:false }
);


export default mongoose.model<IRole>('Role', RoleSchema);
