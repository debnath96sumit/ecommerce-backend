import { Product } from "../models";
import { IProduct } from "../interfaces";
import { BaseRepository } from "./base.repository";
import { FilterQuery } from "mongoose";

 export class ProductRepository extends BaseRepository<IProduct> {
    constructor() {
        super(Product);
    }

    async findOne(filter: FilterQuery<IProduct>): Promise<IProduct | null> {
        return Product.findOne(filter).populate('category').exec();
    }

    async findById(id: string): Promise<IProduct | null> {
        return Product.findById(id).populate('category').exec();
    }

    
}