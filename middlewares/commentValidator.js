import { validateComment } from "../validators/comment.validation.js";

export const commentValidator = (req, res, next) => {
  const { error } = validateComment(req.body);
  if (error) {
    return res.status(400).json({
      errors: error.details.map((err) => err.message),
    });
  }
  next();
};
