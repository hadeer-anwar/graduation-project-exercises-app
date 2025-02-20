import { validateChallenge } from "../validators/challenge.validator.js";

export const challengeValidator = (req, res, next) => {
    const { error } = validateChallenge.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({ errors: error.details.map((err) => err.message) });
    }
    next();
  };