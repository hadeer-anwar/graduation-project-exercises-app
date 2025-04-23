import Joi from "joi";

const validatePost = (data) => {
  const postSchema = Joi.object({
    content: Joi.string().trim().min(5).max(1500).required().messages({
      "string.empty": "Post content cannot be empty",
      "string.min": "Post content must be at least 5 characters",
      "string.max": "Post content must be at most 1500 characters",
      "any.required": "Post content is required",
    }),

    videoUrls: Joi.array()
    .items(
      Joi.string()
        .uri()
        .regex(/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/)
        .messages({
          "string.uri": "Invalid video URL format",
          "string.pattern.base": "Invalid video URL format",
        })
    )
    .optional(),

  imageUrls: Joi.array()
    .items(
      Joi.string()
        .uri()
        .regex(/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/)
        .messages({
          "string.uri": "Invalid image URL format",
          "string.pattern.base": "Invalid image URL format",
        })
    )
    .optional(),
  



  }).unknown(true);

  return postSchema.validate(data, { abortEarly: false });
};

export { validatePost };
