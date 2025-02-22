import Joi from "joi";

export const validateChallenge = Joi.object({
  name: Joi.string().required().messages({
    "string.empty": "Challenge name is required",
  }),

  description: Joi.string().optional(),

  duration: Joi.number().required().messages({
    "number.base": "Duration must be a number",
    "any.required": "Duration is required",
  }),

  exercises: Joi.array()
    .items(
      Joi.object({
        exercise: Joi.string()
          .regex(/^[0-9a-fA-F]{24}$/)
          .required()
          .messages({
            "string.pattern.base": "Invalid exercise ID format",
            "any.required": "Exercise ID is required",
          }),
        repsPerDay: Joi.number().required().messages({
          "number.base": "Reps per day must be a number",
          "any.required": "Reps per day is required",
        }),
      })
    )
    .min(1)
    .required()
    .messages({
      "array.min": "At least one exercise is required",
      "any.required": "Exercises are required",
    }),

  points: Joi.number().default(0),
});
