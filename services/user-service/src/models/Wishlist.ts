// models/Wishlist.ts
import mongoose, { Schema } from "mongoose";
import { IWishlist } from "../interfaces";

const WishlistSchema = new Schema<IWishlist>(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    products: [{ type: Schema.Types.ObjectId }],
  },
  { timestamps: true, versionKey:false }
);

export const Wishlist = mongoose.model<IWishlist>("Wishlist", WishlistSchema);
