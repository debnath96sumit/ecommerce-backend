import mongoose, { Document } from 'mongoose';

export interface IWishlist extends Document {
  user_id: mongoose.Types.ObjectId;
  products: mongoose.Types.ObjectId[];
}