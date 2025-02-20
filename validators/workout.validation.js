import Joi from "joi";
import mongoose from "mongoose";

export const validateWorkout = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(100).required().messages({
      "string.empty": "Workout name cannot be empty",
      "string.min": "Workout name must be at least 3 characters",
      "string.max": "Workout name must be at most 100 characters",
      "any.required": "Workout name is required",
    }),
    description: Joi.string().max(300).optional().messages({
      "string.max": "Description must be at most 300 characters",
    }),
    exercises: Joi.array()
      .items(
        Joi.string()
          .trim()
          .min(1)
          .messages({
            "string.empty": "Exercise name cannot be empty",
            "string.min": "Exercise name must be at least 1 character",
          })
      )
      .min(1)
      .required()
      .messages({
        "array.base": "Exercises must be an array",
        "array.min": "At least one exercise is required",
        "any.required": "Exercises are required",
      }),
  });

  return schema.validate(data, { abortEarly: false });
};

