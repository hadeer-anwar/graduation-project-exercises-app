// validators/message.validation.js
import Joi from 'joi';

export const validateMessage = (data) => {
  const schema = Joi.object({
    message: Joi.string().trim().min(1).max(1000).required().messages({
      "string.empty": "Message cannot be empty",
      "string.min": "Message must be at least 1 character",
      "string.max": "Message must be at most 1000 characters",
      "any.required": "Message is required",
    }),
  });

  return schema.validate(data, { abortEarly: false });
};
