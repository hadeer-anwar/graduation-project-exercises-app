
import Joi from 'joi';
import User from '../user/model/user.model.js';
import appError from '../utils/appError.js';

// User creation validation


export const validateUser = Joi.object({
  name: Joi.string().trim().required(),
  email: Joi.string().email().trim().required(),
  password: Joi.string().min(6).when("googleId", {
    is: Joi.exist(),
    then: Joi.optional(),
    otherwise: Joi.required(),
  }),
  googleId: Joi.string().optional(),
  profilePic: Joi.string().uri().optional().allow(null),
  age: Joi.number().min(0).optional().empty(""),
  height: Joi.number().min(0).optional().empty(""),
  weight: Joi.number().min(0).optional().empty(""),
  fitnessGoal: Joi.string()
    .valid("lose weight", "build muscle", "maintain fitness", "")
    .optional(),
  activityLevel: Joi.string()
    .valid("sedentary", "active", "highly active", "")
    .optional(),
  points: Joi.number().min(0).default(0),
  role: Joi.string().valid("user", "admin").default("user"),
}).unknown(true); // Allows extra fields not defined in the schema


// Password update validation
export const validateUserPassword = Joi.object({
  currentPassword: Joi.string().required().messages({
    "string.empty": "You should enter your current password",
  }),
  password: Joi.string().min(6).required().messages({
    "string.empty": "Password is required",
    "string.min": "Password must be at least 6 characters long",
  }),
  confirmPassword: Joi.string().valid(Joi.ref("password")).required()
  .messages({
    "string.empty": "You should enter password confirmation",
    "any.only": "Password confirmation failed",
  }),
}).unknown(true) // Allows extra fields



