import { Document, Types } from 'mongoose';

export interface ICartItem {
  product_id: Types.ObjectId;
  quantity: number;
  price: number;
}

export interface ICart extends Document {
  user_id: Types.ObjectId; 
  items: ICartItem[];
  total_price: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICartInput {
  product_id: Types.ObjectId;
  quantity: number;
  price: number;
}
