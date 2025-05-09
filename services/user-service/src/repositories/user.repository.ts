import { IUser } from "../interfaces/user.interface";
import User from "../models/User";
import { BaseRepository } from "./base.repository";

export class UserRepository extends BaseRepository<IUser>{
    constructor(){
        super(User);
    }
}