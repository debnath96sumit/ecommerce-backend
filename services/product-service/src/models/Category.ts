import mongoose, { Schema } from "mongoose";
import { ICategory } from "../interfaces";

const CategorySchema = new Schema<ICategory>({
  name: { 
    type: String, 
    required: true, 
    trim: true, 
    unique: true 
  },
  description: { 
    type: String, 
    trim: true 
  },
  slug: { 
    type: String, 
    required: true, 
    unique: true, 
    lowercase: true 
  },
  image: { 
    type: String 
  },
  parent: { 
    type: Schema.Types.ObjectId, 
    ref: 'Category' 
  },
  isActive: { 
    type: Boolean, 
    default: true 
  },
  sortOrder: { 
    type: Number, 
    default: 0 
  }
}, {
  timestamps: true,
  versionKey: false
});

export const Category = mongoose.model<ICategory>('Category', CategorySchema);
