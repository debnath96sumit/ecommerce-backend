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
}, {
  timestamps: true,
  versionKey: false
});


//generate slug from name
CategorySchema.pre('save', function(next) {
  this.slug = this.name.toLowerCase().replace(/ /g, '-');
  next();
})
export const Category = mongoose.model<ICategory>('Category', CategorySchema);
