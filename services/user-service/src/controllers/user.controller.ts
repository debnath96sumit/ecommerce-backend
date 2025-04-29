import { Request, Response } from 'express';
import User from '../models/User';

class UserController {
    public async createUser(req: Request, res: Response) {
      try {
        const { name, email, password } = req.body;
    
        const user = new User({ name, email, password });
        await user.save();
    
        res.status(201).json({ message: 'User created successfully', user });
      } catch (error: any) {
        res.status(500).json({ message: 'Error creating user', error: error.message });
      }
    };
}

export default new UserController();