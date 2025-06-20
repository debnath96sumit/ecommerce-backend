import {Model, Document, UpdateQuery, FilterQuery} from 'mongoose';

export class BaseRepository<T extends Document>{
    private readonly model: Model<T>;

    constructor(model: Model<T>){
        this.model = model;
    }

    async create(data: Partial<T>): Promise<T>{
        return await this.model.create(data);
    }

    async findOne(query: FilterQuery<T>): Promise<T | null>{
        return await this.model.findOne(query).exec();
    }

    async getAll(query: FilterQuery<T>): Promise<T[]>{
        return await this.model.find(query).exec();
    }
}