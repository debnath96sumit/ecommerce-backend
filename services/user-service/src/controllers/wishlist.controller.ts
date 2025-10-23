import { Request, Response } from "express";
import { WishlistRepository } from "../repositories/wishlist.repository";
import { AuthenticatedRequest } from '../interfaces';
import { isValidObjectId, Types } from "mongoose";
import { sendEvent } from "../utils/SendEvent";
import { UserEvent } from "../types"
import { productsDetailsMap } from "../events/EventDataStore";


class WishlistController {
    private readonly wishlistRepo: WishlistRepository;

    constructor() {
        this.wishlistRepo = new WishlistRepository();
    }

    public getMyWishlist = async (req: AuthenticatedRequest, res: Response) => {
        try {
            const user_id = req.user?.id;
            const wishlist = await this.wishlistRepo.findOne({ user_id });
            
            if (!wishlist) {
                res.status(200).json({ message: "Wishlist fetched", data: null });
                return;
            }
            
            const wishlistData = wishlist.toObject();
            
            if (wishlistData.products && wishlistData.products.length > 0) {
                const product_details = await sendEvent({
                    publishData: {
                        topic: "ProductEvents",
                        event: UserEvent.GET_PRODUCTS_REQUEST,
                        message: {
                            product_ids: wishlistData.products,
                            topic: 'UserEvents',
                            selectedFields: ['name', 'price']
                        }
                    },
                    waitForResponse: {
                        map: productsDetailsMap,
                        expectedKeys: wishlistData.products.map((id: Types.ObjectId) => id.toString())
                    }
                });
                
                if (product_details && product_details.size > 0) {
                    wishlistData.products = wishlistData.products
                        .map((id: Types.ObjectId) => {
                            const productDoc = product_details.get(id.toString());
                            if (!productDoc) return null;
                            return productDoc.toObject ? productDoc.toObject() : productDoc;
                        })
                        .filter(Boolean);
                }
            }
            
            res.status(200).json({ message: "Wishlist fetched", data: wishlistData });
            return;
        } catch (error) {
            console.log("error", error);
            res.status(500).json({ success: false, message: 'Error in fetching wishlist' });
            return;
        }
    };

    public addToWishlist = async (req: AuthenticatedRequest, res: Response) => {
        try {
            const user_id = req.user?.id;
            if (!user_id) {
                res.status(400).json({ message: "User not found" });
                return;
            }
            const { product_id } = req.body;
            if (!product_id || !isValidObjectId(product_id)) {
                res.status(400).json({ message: "Invalid product id" });
                return;
            }
            const updated = await this.wishlistRepo.addProduct(
                user_id,
                product_id
            )
            res.status(200).json({ message: "Added to wishlist", data: updated });
            return;
        } catch (error) {
            console.log("error", error);
            res.status(500).json({ success: false, message: 'Error in adding to wishlist' });
            return;
        }
    };

    public removeFromWishlist = async (req: AuthenticatedRequest, res: Response) => {
        try {
            const user_id = req.user?.id;
            if (!user_id) {
                res.status(400).json({ message: "User not found" });
                return;
            }
            const { product_id } = req.body;
            if (!product_id || !isValidObjectId(product_id)) {
                res.status(400).json({ message: "Invalid product id" });
                return;
            }
            const updated = await this.wishlistRepo.removeProduct(user_id, product_id);

            res.status(200).json({ message: "Removed from wishlist", data: updated });
            return;
        } catch (error) {
            console.log("error", error);
            res.status(500).json({ success: false, message: 'Error in adding to wishlist' });
            return;
        }
    };
}

export default new WishlistController();
