import { Order } from "../models/Order";
import { IOrder } from "../interfaces";
import { BaseRepository } from "./base.repository";

export class OrderRepository extends BaseRepository<IOrder> {
    constructor() {
        super(Order);
    }
}