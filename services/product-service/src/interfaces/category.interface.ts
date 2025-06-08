import mongoose, { Document } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  description?: string;
  slug: string;
  image?: string;
  parent?: mongoose.Types.ObjectId;
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}