import { Request, Response } from 'express';
import { userRegisterSchema } from '../validations/user.validation';
import { GOOGLE_CLIENT_ID, JWT_SECRET } from '../config';
import jwt from 'jsonwebtoken';
import { AuthenticatedRequest } from '../interfaces';
import { UserRepository } from '../repositories/user.repository';
import { OAuth2Client } from 'google-auth-library';
import { Role } from '../models/Role';


class UserController {
    private readonly userRepo: UserRepository;
    private readonly client = new OAuth2Client(GOOGLE_CLIENT_ID);

    constructor() {
        this.userRepo = new UserRepository();
    }

    public createUser = async (req: Request, res: Response) => {
        const { error, value } = userRegisterSchema.validate(req.body);
        if (error) {
            res.status(400).json({ message: error.details[0].message });
            return;
        }
        try {
            const existUser = await this.userRepo.findOne({ email: value.email });
            if (existUser) {
                res.status(400).json({ message: 'User already exists' });
                return;
            }
            const userRole = await Role.findOne({
                name: value.type,
            });

            if (!userRole) {
                res.status(400).json({ message: 'Role not found' });
                return;
            }
            value.role = userRole.id;
            delete value.type;
            const newUser = await this.userRepo.create(value);

            if (newUser) {
                res.status(201).json({ message: 'User registered successfully', data: newUser });
                return;
            }
            res.status(500).json({ message: 'Failed to registerd', data: null });
            return;
        } catch (error: any) {
            res.status(500).json({ message: 'Error creating user', error: error.message });
        }
    };

    public login = async (req: Request, res: Response) => {
        try {
            const { email, password } = req.body;
            const user = await this.userRepo.findOne({ email });
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
                {
                    id: user._id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                },
                JWT_SECRET,
                { expiresIn: '1h' }
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
    public googleSignIn = async (req: Request, res: Response) => {
        const { token } = req.body;
        if (!token) {
            res.status(400).json({ message: 'Google token is required' });
            return;
        }
        try {
            const ticket = await this.client.verifyIdToken({
                idToken: token,
                audience: GOOGLE_CLIENT_ID,
            });

            const payload = ticket.getPayload();
            if (!payload) {
                res.status(400).json({ message: 'Invalid Google token' });
                return;
            }

            const { sub: googleId, email, name, picture } = payload;

            if (!email) {
                res.status(400).json({ message: 'Google account does not have an email address' });
                return;
            }

            let user = await this.userRepo.findOne({ email });

            if (!user) {
                const userRole = await Role.findOne({
                    name: 'customer',
                });

                if (!userRole) {
                    res.status(400).json({ message: 'Role not found' });
                    return;
                }

                const user_payload = {
                    name,
                    email,
                    role: userRole.id,
                    password: 'Password@123',
                };
                user = await this.userRepo.create(user_payload);
                if (!user) {
                    res.status(400).json({ message: 'Failed to create user' });
                    return;
                }
            }
            const accessToken = jwt.sign(
                {
                    id: user._id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                },
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
            if (!user) {
                res.status(404).json({ success: false, message: 'User not found' });
                return;
            }
            res.status(200).json({ success: true, user });
            return;
        } catch (error) {
            console.log("error", error);
            res.status(500).json({ success: false, message: 'Error user profile' });
            return;
        }
    }

    public refreshToken = async (req: Request, res: Response) => {
        try {
            const { refreshToken } = req.body;
            if (!refreshToken) {
                res.status(400).json({ message: 'Refresh token is required' });
                return;
            }

            const decoded = jwt.verify(refreshToken, JWT_SECRET) as { id: string };
            const user = await this.userRepo.findOne({ _id: decoded.id });

            if (!user || !user.refreshToken || user.refreshToken !== refreshToken) {
                res.status(401).json({ message: 'Invalid refresh token' });
                return;
            }
            console.log("user", user);

            const accessToken = jwt.sign(
                {
                    id: user._id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                },
                JWT_SECRET,
                { expiresIn: '15m' }
            );

            res.status(200).json({
                message: 'Token refreshed successfully',
                accessToken
            });
            return;
        } catch (error: any) {
            if (error.name === 'TokenExpiredError') {
                res.status(401).json({ message: 'Refresh token has expired' });
                return;
            }
            res.status(500).json({ message: 'Error refreshing token', error: error.message });
        }
    }

    public logout = async (req: Request, res: Response) => {
        try {
            const { refreshToken } = req.body;
            if (!refreshToken) {
                res.status(400).json({ message: 'Refresh token is required' });
                return;
            }

            const decoded = jwt.verify(refreshToken, JWT_SECRET) as { id: string };
            const user = await this.userRepo.findById(decoded.id);

            if (!user) {
                res.status(404).json({ message: 'User not found' });
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