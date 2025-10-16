import joi from 'joi';
import { z } from 'zod';
export const userRegisterSchema = joi.object({
    name: joi.string().min(3).max(30).required().messages({
        'string.base': 'Name should be a type of text',
        'string.empty': 'Name cannot be an empty field',
        'string.min': 'Name should have a minimum length of {#limit}',
        'string.max': 'Name should have a maximum length of {#limit}',
        'any.required': 'Name is a required field',
    }),
    email: joi.string().email().required().messages({
        'string.base': 'Email should be a type of text',
        'string.empty': 'Email cannot be an empty field',
        'string.email': 'Email must be a valid email',
        'any.required': 'Email is a required field',
    }),
    type: joi.string().valid('customer', 'vendor').required().messages({
        'string.base': 'Type should be a type of text',
        'any.only': 'Type must be either customer or vendor',
        'any.required': 'Type is a required field',
    }),
    password: joi.string().min(6).max(30).required().messages({
        'string.base': 'Password should be a type of text',
        'string.empty': 'Password cannot be an empty field',
        'string.min': 'Password should have a minimum length of {#limit}',
        'string.max': 'Password should have a maximum length of {#limit}',
        'any.required': 'Password is a required field',
    }),
})

export const loginSchema = z.object({
    email: z.string().email({ message: 'Invalid email address' }),
    password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});