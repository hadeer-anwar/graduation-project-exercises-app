// middlewares/challengeValidator.js
import { validateChallenge } from '../validators/challenge.validation.js';

export const challengeValidator = (req, res, next) => {
  const { error } = validateChallenge(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      errors: error.details.map(err => err.message),
    });
  }
  next();
};
