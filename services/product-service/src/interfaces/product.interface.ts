import mongoose, { Document } from 'mongoose';

// export interface IProduct extends Document {
//   name: string;
//   description: string;
//   shortDescription?: string;
//   price: number;
//   compareAtPrice?: number;
//   costPrice?: number;
//   sku: string;
//   barcode?: string;
//   category: mongoose.Types.ObjectId;
//   subcategory?: mongoose.Types.ObjectId;
//   brand?: string;
//   tags: string[];
//   images: {
//     url: string;
//     alt: string;
//     isPrimary: boolean;
//   }[];
//   inventory: {
//     quantity: number;
//     reserved: number;
//     lowStockThreshold: number;
//     trackQuantity: boolean;
//   };
//   variants?: {
//     name: string;
//     options: {
//       name: string;
//       value: string;
//       price?: number;
//       sku?: string;
//       inventory?: number;
//     }[];
//   }[];
//   seo: {
//     metaTitle?: string;
//     metaDescription?: string;
//     slug: string;
//   };
//   specifications: {
//     key: string;
//     value: string;
//   }[];
//   weight?: number;
//   dimensions?: {
//     length: number;
//     width: number;
//     height: number;
//     unit: string;
//   };
//   isActive: boolean;
//   isFeatured: boolean;
//   isDigital: boolean;
//   rating: {
//     average: number;
//     count: number;
//   };
//   createdAt: Date;
//   updatedAt: Date;
// }

export interface IProduct extends Document {
  _id: mongoose.Types.ObjectId;
    name: string;
  description: string;
  category: mongoose.Types.ObjectId;
  price: number;
  images: {
    url: string;
    alt: string;
    isPrimary: boolean;
  }[];
  stock: number;
  isFeatured?: boolean;
  vendor_id: mongoose.Types.ObjectId;
  status: 'Active' | 'Inactive';
}