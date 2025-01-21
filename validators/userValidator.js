import { check } from 'express-validator'
import User from '../user/model/user.model.js';
import appError from '../utils/appError.js';

// User validators
export const createUserValidator = [
  check('name')
    .notEmpty()
    .withMessage('User name is required')
    .isLength({ min: 2 })
    .withMessage('User name must be at least 2 characters long'),
   
  check('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email address')
    .custom(async (val) => {
      const existingUser = await User.findOne({ email: val });
      if (existingUser) {
        throw new appError('Email already in use');
      }
      return true;
    }),

  check('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),

  check('profilePic')
    .optional(),

];


export const passwordValidator = [
    check('password')
      .notEmpty()
      .withMessage('Password is required')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long'),
  ];

  
  export const dynamicUserValidators = [
    check('name')
      .optional()
      .isLength({ min: 2 })
      .withMessage('User name must be at least 2 characters long'),
  
    check('email')
      .optional()
      .isEmail()
      .withMessage('Invalid email address')
      .custom(async (val) => {
        const existingUser = await User.findOne({ email: val });
        if (existingUser) {
          throw new appError('Email already in use');
        }
        return true;
      }),
  
  ];
  