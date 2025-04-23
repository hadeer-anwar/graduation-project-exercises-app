import Joi from 'joi';

const validateComment = (data) => {
  const commentSchema = Joi.object({
    content: Joi.string().trim().min(2).max(500).required().messages({
      "string.empty": "Comment content cannot be empty",
      "string.min": "Comment must be at least 2 characters",
      "string.max": "Comment must be at most 500 characters",
      "any.required": "Comment content is required",
    })
  });

  return commentSchema.validate(data, { abortEarly: false });
};
export {validateComment}