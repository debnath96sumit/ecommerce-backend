import { IWishlist } from "../interfaces";
import {Wishlist} from "../models";
import { BaseRepository } from "./base.repository";

export class WishlistRepository extends BaseRepository<IWishlist> {
    constructor() {
        super(Wishlist);
    }
}