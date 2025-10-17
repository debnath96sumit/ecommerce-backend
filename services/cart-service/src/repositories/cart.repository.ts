import { Cart } from "../models";
import { ICart } from "../interfaces";
import { BaseRepository } from "./base.repository";
import { FilterQuery } from "mongoose";

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

    
}