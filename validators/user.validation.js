
import Joi from 'joi';
import User from '../user/model/user.model.js';
import bcrypt from 'bcryptjs';
import appError from '../utils/appError.js';

// User creation validation
export const validateUser = Joi.object({
  name: Joi.string().min(2).required().messages({
    'string.empty': 'User name is required',
    'string.min': 'User name must be at least 2 characters long'
  }),
  email: Joi.string().email().required().external(async (val) => {
    const existingUser = await User.findOne({ email: val });
    if (existingUser) {
      throw new appError('Email already in use');
    }
  }).messages({
    'string.empty': 'Email is required',
    'string.email': 'Invalid email address'
  }),
  password: Joi.string().min(6).required().messages({
    'string.empty': 'Password is required',
    'string.min': 'Password must be at least 6 characters long'
  }),
  profilePic: Joi.string().optional()
});

// Password update validation
export const validateUserPassword = Joi.object({
  currentPassword: Joi.string().required().messages({
    'string.empty': 'You should enter your current password'
  }),
  password: Joi.string().min(6).required().messages({
    'string.empty': 'Password is required',
    'string.min': 'Password must be at least 6 characters long'
  }),
  confirmPassword: Joi.string().required().valid(Joi.ref('password')).messages({
    'string.empty': 'You should enter password confirmation',
    'any.only': 'Password confirmation failed'
  })
}).external(async (value, helpers) => {
  const user = await User.findById(helpers.state.ancestors[0].params.id);
  if (!user) throw new appError('User not found');

  const isCorrect = await bcrypt.compare(value.currentPassword, user.password);
  if (!isCorrect) throw new appError('Incorrect Password');

  return value;
});

// Dynamic user update validation
export const validateUpdateUser = Joi.object({
  name: Joi.string().min(2).optional().messages({
    'string.min': 'User name must be at least 2 characters long'
  }),
  email: Joi.string().email().optional().external(async (val) => {
    const existingUser = await User.findOne({ email: val });
    if (existingUser) {
      throw new appError('Email already in use');
    }
  }).messages({
    'string.email': 'Invalid email address'
  })
});
