// middlewares/messageValidator.js
import { validateMessage } from "../validators/message.validation.js";

export const messageValidator = (req, res, next) => {
  const { error } = validateMessage(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      errors: error.details.map((err) => err.message),
    });
  }
  next();
};
