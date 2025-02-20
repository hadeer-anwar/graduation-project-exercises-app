import Joi from "joi";

const validateExercise = (data) => {
  const exerciseSchema = Joi.object({
    name: Joi.string().trim().min(2).max(100).required().messages({
      "string.empty": "Exercise name cannot be empty",
      "string.min": "Exercise name must be at least 2 characters",
      "string.max": "Exercise name must be at most 100 characters",
      "any.required": "Exercise name is required",
    }),

    description: Joi.string().trim().min(10).max(500).required().messages({
      "string.empty": "Description cannot be empty",
      "string.min": "Description must be at least 10 characters",
      "string.max": "Description must be at most 500 characters",
      "any.required": "Description is required",
    }),

    targetMuscles: Joi.array()
      .items(Joi.string().trim().min(2).messages({
        "string.empty": "Muscle name cannot be empty",
        "string.min": "Muscle name must be at least 2 characters",
      }))
      .min(1)
      .required()
      .messages({
        "array.base": "Target muscles must be an array",
        "array.min": "At least one target muscle is required",
        "any.required": "Target muscles are required",
      }),

    equipment: Joi.string()
      .valid("bodyweight", "dumbbell", "barbell", "machine", "resistance band")
      .default("bodyweight")
      .messages({
        "any.only": "Invalid equipment type",
      }),

    difficulty: Joi.string()
      .valid("beginner", "intermediate", "advanced")
      .default("beginner")
      .messages({
        "any.only": "Invalid difficulty level",
      }),

    videoUrl: Joi.string().uri().optional().messages({
      "string.uri": "Invalid video URL format",
    }),

    imagesUrl: Joi.array()
      .items(Joi.string().uri().messages({
        "string.uri": "Invalid image URL format",
      }))
      .optional(),
  });

  return exerciseSchema.validate(data, { abortEarly: false });
};

export { validateExercise };
