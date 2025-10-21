import { Cart } from "../models";
import { ICart } from "../interfaces";
import { BaseRepository } from "./base.repository";
import { FilterQuery, Types } from "mongoose";

export class CartRepository extends BaseRepository<ICart> {
    constructor() {
        super(Cart);
    }
    async findOne(filter: FilterQuery<ICart>): Promise<ICart | null> {
        return Cart.findOne(filter).exec();
    }

    async findById(id: string): Promise<ICart | null> {
        return Cart.findById(id).exec();
    }

    async addOrUpdateItem(user_id: Types.ObjectId, product_id: Types.ObjectId, quantity: number, price: number): Promise<ICart> {
        const cart = await Cart.findOne({ user_id });

        if (!cart) {
            return Cart.create({
                user_id,
                items: [{ product_id, quantity, price }],
                total_price: price * quantity,
            });
        }

        const existingItem = cart.items.find(
            (item) => item.product_id.toString() === product_id.toString()
        );

        if (existingItem) {
            existingItem.quantity += quantity;
            existingItem.price = price;
        } else {
            cart.items.push({ product_id, quantity, price });
        }

        cart.total_price = cart.items.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
        );

        return cart.save();
    }

    async incrementItem(user_id: Types.ObjectId, product_id: Types.ObjectId): Promise<ICart | null> {
        const cart = await Cart.findOne({ user_id });
        if (!cart) return null;

        const item = cart.items.find((i) => i.product_id.toString() === product_id.toString());
        if (!item) return null;

        item.quantity += 1;
        cart.total_price = cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0);

        return cart.save();
    }

    async decrementItem(user_id: Types.ObjectId, product_id: Types.ObjectId): Promise<ICart | null> {
        const cart = await Cart.findOne({ user_id });
        if (!cart) return null;

        const item = cart.items.find((i) => i.product_id.toString() === product_id.toString());
        if (!item) return null;

        item.quantity = Math.max(item.quantity - 1, 0);

        cart.items = cart.items.filter((i) => i.quantity > 0);

        cart.total_price = cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0);

        return cart.save();
    }

    async removeItem(user_id: Types.ObjectId, product_id: Types.ObjectId): Promise<ICart | null> {
        const cart = await Cart.findOne({ user_id });
        if (!cart) return null;

        const itemExists = cart.items.some(
            (item) => item.product_id.toString() === product_id.toString()
        );

        if (!itemExists) return null;

        cart.items = cart.items.filter(
            (item) => item.product_id.toString() !== product_id.toString()
        );

        cart.total_price = cart.items.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
        );

        return cart.save();
    }


}