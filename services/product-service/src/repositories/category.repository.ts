import { Category } from "../models";
import { ICategory } from "../interfaces";
import { BaseRepository } from "./base.repository";

 export class CategoryRepository extends BaseRepository<ICategory> {
    constructor() {
        super(Category);
    }
}