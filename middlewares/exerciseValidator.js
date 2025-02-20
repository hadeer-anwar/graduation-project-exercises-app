import { validateExercise } from "../validators/exercise.validation.js";

export const exerciseValidator = (req, res, next) => {
  const { error } = validateExercise(req.body);
  if (error) {
    return res.status(400).json({ errors: error.details.map((err) => err.message) });
  }
  next();
};
