
import Joi from 'joi';
import User from '../user/model/user.model.js';
import bcrypt from 'bcryptjs';
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
  achievements: Joi.array().items(Joi.string().hex().length(24)).optional(),
  workingChallenges: Joi.array().items(
    Joi.object({
      challenge: Joi.string().hex().length(24).required(),
      streakDays: Joi.number().min(0).default(0),
      completedDays: Joi.number().min(0).default(0),
      pointsEarned: Joi.number().min(0).default(0),
      isCompleted: Joi.boolean().default(false),
      lastUpdated: Joi.date().optional(),
    })
  ),
  workoutHistory: Joi.array().items(Joi.string().hex().length(24)).optional(),
  role: Joi.string().valid("user", "admin").default("user"),
}).unknown(true); // Allows extra fields not defined in the schema





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
