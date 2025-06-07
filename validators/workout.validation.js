import Joi from "joi";
import mongoose from "mongoose";

export const validateWorkout = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(100).required().messages({
      "string.empty": "Workout name cannot be empty",
      "string.min": "Workout name must be at least 3 characters",
      "string.max": "Workout name must be at most 100 characters",
    }),
    description: Joi.string().max(300).optional().messages({
      "string.max": "Description must be at most 300 characters",
    }),
    exercises: Joi.array().optional(),
    imageUrl: Joi.string().optional()
  });

  return schema.validate(data, { abortEarly: false });
};

