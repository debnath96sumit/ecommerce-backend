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

    async find(query: FilterQuery<T>): Promise<T[]>{
        return await this.model.find(query).exec();
    }

    async findById(id: string): Promise<T | null>{
        return await this.model.findById(id).exec();
    }

    getModel(): Model<T> {
        return this.model;
    }
}