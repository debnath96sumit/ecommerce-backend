import { IWishlist } from "../interfaces";
import {Wishlist} from "../models";
import { BaseRepository } from "./base.repository";
import { Types } from "mongoose";
export class WishlistRepository extends BaseRepository<IWishlist> {
    constructor() {
        super(Wishlist);
    }

    async addProduct(user_id: Types.ObjectId, product_id: Types.ObjectId): Promise<IWishlist | null> {
        try {
            return Wishlist.findOneAndUpdate(
                { user_id },
                { $addToSet: { products: product_id } },
                { upsert: true, new: true }
            );
        } catch (error) {
            console.error('Error saving document:', error);
            throw new Error('Error saving document');
        }
    }

    async removeProduct(user_id: Types.ObjectId, product_id: Types.ObjectId): Promise<IWishlist | null> {
        try {
            return Wishlist.findOneAndUpdate(
                { user_id },
                { $pull: { products: product_id } },
                { new: true }
            );
        } catch (error) {
            console.error('Error updating document:', error);
            throw new Error('Error updating document');
        }
    }
}