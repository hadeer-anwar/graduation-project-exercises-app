// validators/challenge.validation.js
import Joi from 'joi';
import mongoose from 'mongoose';

// Helper to validate ObjectId
const objectId = Joi.string().custom((value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.error('any.invalid');
  }
  return value;
}, 'ObjectId validation');

export const validateChallenge = (data) => {
  const baseSchema = Joi.object({
    type: Joi.string().valid('exercise', 'trivia').required(),
    points: Joi.number().min(0).default(10),
    content: Joi.string().allow('', null),
  });

  const exerciseSchema = Joi.object({
    exerciseId: objectId.required().messages({
      'any.invalid': 'Invalid exerciseId',
      'any.required': 'exerciseId is required',
    }),
    calcMethod: Joi.string().valid('reps', 'time').required(),
    target: Joi.number().min(1).messages({
      'number.min': 'Target must be at least 1',
    }),
  });

  const triviaSchema = Joi.object({
    questionId: objectId.required().messages({
      'any.invalid': 'Invalid questionId',
      'any.required': 'questionId is required',
    }),
    timeLimit: Joi.number().min(5).default(30).messages({
      'number.min': 'Time limit must be at least 5 seconds',
    }),
  });

  // Start with base validation
  const { error: baseError, value: baseValue } = baseSchema.validate(data);
  if (baseError) return { error: baseError };

  // Add type-specific validation
  if (baseValue.type === 'exercise') {
    return exerciseSchema.validate(data, { abortEarly: false });
  } else if (baseValue.type === 'trivia') {
    return triviaSchema.validate(data, { abortEarly: false });
  }

  return { error: null }; // fallback
};
