import { Request, Response } from 'express';
import User from '../models/User';
import { userRegisterSchema } from '../validations/user.validation';

class UserController {
    public async createUser(req: Request, res: Response) {
      const {error, value} = userRegisterSchema.validate(req.body);
      if (error) {
        res.status(400).json({ message: error.details[0].message });
        return;
      }
      try {
        const existUser = await User.findOne({ email: value.email}).exec();
        if(existUser) {
          res.status(400).json({ message: 'User already exists' });
          return;
        }
        const user = new User(value);
        await user.save();
    
        res.status(201).json({ message: 'User created successfully', user });
      } catch (error: any) {
        res.status(500).json({ message: 'Error creating user', error: error.message });
      }
    };
}

export default new UserController();