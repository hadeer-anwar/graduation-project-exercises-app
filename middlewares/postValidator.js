import { validatePost } from "../validators/post.validation.js";

export const postValidator = (req, res, next) => {
  const { error } = validatePost(req.body);
  if (error) {
    return res.status(400).json({
      errors: error.details.map((err) => err.message),
    });
  }
  next();
};
