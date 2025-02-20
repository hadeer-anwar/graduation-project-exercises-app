import { validateWorkout } from "../validators/workout.validation.js";

export const workoutValidator = (req, res, next) => {
  const { error } = validateWorkout(req.body);
  if (error) {
    return res.status(400).json({ errors: error.details.map((err) => err.message) });
  }
  next(); 
};