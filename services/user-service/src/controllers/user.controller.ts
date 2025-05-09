import { Request, Response } from 'express';
import User from '../models/User';
import { userRegisterSchema } from '../validations/user.validation';
import { JWT_SECRET } from '../config';
import jwt from 'jsonwebtoken';
import { AuthenticatedRequest } from '../interfaces';
import { UserRepository } from '../repositories/user.repository';

class UserController {
    private readonly userRepo: UserRepository;
    constructor(){
        this.userRepo = new UserRepository();
    }

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

    public async login(req: Request, res: Response) {
      try {
        const {email, password} = req.body;
        const user = await User.findOne({ email }).exec();
        if (!user) {
            res.status(400).json({ message: 'Invalid email or password' });
            return;
        }
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            res.status(400).json({ message: 'Invalid email or password' });
            return;
        }

        const accessToken = jwt.sign(
            { id: user._id, role: user.role },
            JWT_SECRET,
            { expiresIn: '15m' }
        );

        const refreshToken = await user.generateRefreshToken();

        res.status(200).json({ 
            message: 'Login successful', 
            user,
            accessToken,
            refreshToken
        });
      } catch (error: any) {
          res.status(500).json({ message: 'Error logging in', error: error.message });
      }
    }

    public getProfile = async (req: AuthenticatedRequest, res: Response) => {
        try {
            const user = await this.userRepo.findOne({ _id: req?.user?.id });
            if(!user){
                res.status(404).json({success: false, message: 'User not found'});
                return;
            }
            res.status(200).json({success: true, user});
            return;
        } catch (error) {
            console.log("error", error);
            res.status(500).json({success: false, message: 'Error user profile'});
            return;
        }
    }

    public async refreshToken(req: Request, res: Response) {
        try {
            const { refreshToken } = req.body;
            if (!refreshToken) {
                res.status(400).json({ message: 'Refresh token is required' });
                return;
            }

            const decoded = jwt.verify(refreshToken, JWT_SECRET) as { id: string };
            const user = await User.findById(decoded.id);

            if (!user || !user.refreshToken || user.refreshToken !== refreshToken) {
                res.status(401).json({ message: 'Invalid refresh token' });
                return;
            }

            const accessToken = jwt.sign(
                { id: user._id, role: user.role },
                JWT_SECRET,
                { expiresIn: '15m' } 
            );

            res.status(200).json({ 
                message: 'Token refreshed successfully', 
                accessToken
            });
        } catch (error: any) {
            if (error.name === 'TokenExpiredError') {
                res.status(401).json({ message: 'Refresh token has expired' });
                return;
            }
            res.status(500).json({ message: 'Error refreshing token', error: error.message });
        }
    }

    public async logout(req: Request, res: Response) {
        try {
            const { refreshToken } = req.body;
            if (!refreshToken) {
              res.status(400).json({ message: 'Refresh token is required' });
              return;
            }

            const decoded = jwt.verify(refreshToken, JWT_SECRET) as { id: string };
            const user = await User.findById(decoded.id);

            if (!user) {
              res.status(400).json({ message: 'User not found' });
              return;
            }

            await user.invalidateRefreshToken();
            res.status(200).json({ message: 'Logout successful' });
            return;
        } catch (error: any) {
            res.status(500).json({ message: 'Error logging out', error: error.message });
            return;
        }
    }
}

export default new UserController();