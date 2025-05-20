import Joi from 'joi';

export const validateTriviaQuestion = (data) => {
  const schema = Joi.object({
    question: Joi.string().trim().min(5).max(500).required().messages({
      "string.empty": "Question cannot be empty",
      "string.min": "Question must be at least 5 characters",
      "string.max": "Question must be at most 500 characters",
      "any.required": "Question is required"
    }),

    options: Joi.array()
      .items(Joi.string().trim().min(1).required())
      .min(2)
      .max(4)
      .required()
      .messages({
        "array.base": "Options must be an array",
        "array.min": "At least 2 options are required",
        "array.max": "No more than 4 options are allowed",
        "any.required": "Options are required",
        "string.empty": "Each option must be a non-empty string"
      }),

    correctAnswer: Joi.string().trim().required().messages({
      "string.empty": "Correct answer cannot be empty",
      "any.required": "Correct answer is required"
    }),

    points: Joi.number().integer().min(0).default(10).messages({
      "number.base": "Points must be a number",
      "number.min": "Points must be 0 or more"
    })
  });

  return schema.validate(data, { abortEarly: false });
};
