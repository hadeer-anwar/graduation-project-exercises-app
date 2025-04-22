import Joi from "joi";

const validatePost = (data) => {
  const postSchema = Joi.object({
    content: Joi.string().trim().min(5).max(1000).required().messages({
      "string.empty": "Post content cannot be empty",
      "string.min": "Post content must be at least 5 characters",
      "string.max": "Post content must be at most 1500 characters",
      "any.required": "Post content is required",
    }),

    image: Joi.string().uri().optional().messages({
      "string.uri": "Invalid image URL format",
    }),

    tags: Joi.array().items(
      Joi.string().trim().min(1).max(30).messages({
        "string.min": "Each tag must be at least 1 character",
        "string.max": "Each tag must be at most 30 characters",
      })
    ).optional(),

    visibility: Joi.string()
      .valid("public", "private", "friends")
      .default("public")
      .messages({
        "any.only": "Visibility must be one of: public, private, or friends",
      }),

  }).unknown(true);

  return postSchema.validate(data, { abortEarly: false });
};

export { validatePost };
