import { FilterQuery } from "mongoose";
import { IUser } from "../interfaces/user.interface";
import User from "../models/User";
import { BaseRepository } from "./base.repository";

export class UserRepository extends BaseRepository<IUser> {
    constructor() {
        super(User);
    }

    async findOne(filter: FilterQuery<IUser>): Promise<IUser | null>{
        return User.findOne(filter).populate('role').exec();
    }

    // Optionally override findById or any others where needed
    async findById(id: string) {
        return User.findById(id).populate('role').exec();
    }
}