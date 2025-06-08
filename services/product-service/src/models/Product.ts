import mongoose, { Schema } from "mongoose";
import { IProduct } from "../interfaces";

const ProductSchema = new Schema<IProduct>({
  name: { 
    type: String, 
    required: true, 
    trim: true,
    maxlength: 200
  },
  description: { 
    type: String, 
    required: true,
    maxlength: 5000
  },
  shortDescription: { 
    type: String, 
    maxlength: 500 
  },
  price: { 
    type: Number, 
    required: true, 
    min: 0 
  },
  compareAtPrice: { 
    type: Number, 
    min: 0 
  },
  costPrice: { 
    type: Number, 
    min: 0 
  },
  sku: { 
    type: String, 
    required: true, 
    unique: true, 
    trim: true 
  },
  barcode: { 
    type: String, 
    trim: true 
  },
  category: { 
    type: Schema.Types.ObjectId, 
    ref: 'Category', 
    required: true 
  },
  subcategory: { 
    type: Schema.Types.ObjectId, 
    ref: 'Category' 
  },
  brand: { 
    type: String, 
    trim: true 
  },
  tags: [{ 
    type: String, 
    trim: true 
  }],
  images: [{
    url: { type: String, required: true },
    alt: { type: String, default: '' },
    isPrimary: { type: Boolean, default: false }
  }],
  inventory: {
    quantity: { type: Number, default: 0, min: 0 },
    reserved: { type: Number, default: 0, min: 0 },
    lowStockThreshold: { type: Number, default: 10, min: 0 },
    trackQuantity: { type: Boolean, default: true }
  },
  variants: [{
    name: { type: String, required: true },
    options: [{
      name: { type: String, required: true },
      value: { type: String, required: true },
      price: { type: Number, min: 0 },
      sku: { type: String },
      inventory: { type: Number, min: 0 }
    }]
  }],
  seo: {
    metaTitle: { type: String, maxlength: 60 },
    metaDescription: { type: String, maxlength: 160 },
    slug: { 
      type: String, 
      required: true, 
      unique: true, 
      trim: true,
      lowercase: true
    }
  },
  specifications: [{
    key: { type: String, required: true },
    value: { type: String, required: true }
  }],
  weight: { 
    type: Number, 
    min: 0 
  },
  dimensions: {
    length: { type: Number, min: 0 },
    width: { type: Number, min: 0 },
    height: { type: Number, min: 0 },
    unit: { type: String, enum: ['cm', 'inch'], default: 'cm' }
  },
  isActive: { 
    type: Boolean, 
    default: true 
  },
  isFeatured: { 
    type: Boolean, 
    default: false 
  },
  isDigital: { 
    type: Boolean, 
    default: false 
  },
  rating: {
    average: { type: Number, default: 0, min: 0, max: 5 },
    count: { type: Number, default: 0, min: 0 }
  },
  createdBy: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  versionKey: false
});

// Indexes for better query performance
ProductSchema.index({ category: 1, isActive: 1 });
ProductSchema.index({ price: 1 });
ProductSchema.index({ 'seo.slug': 1 });
ProductSchema.index({ sku: 1 });
ProductSchema.index({ name: 'text', description: 'text', tags: 'text' });

// Virtual for availability
ProductSchema.virtual('isAvailable').get(function() {
  return this.isActive && (!this.inventory.trackQuantity || this.inventory.quantity > 0);
});

// Virtual for discounted price
ProductSchema.virtual('discountPercentage').get(function() {
  if (this.compareAtPrice && this.compareAtPrice > this.price) {
    return Math.round(((this.compareAtPrice - this.price) / this.compareAtPrice) * 100);
  }
  return 0;
});

export const Product = mongoose.model<IProduct>('Product', ProductSchema);