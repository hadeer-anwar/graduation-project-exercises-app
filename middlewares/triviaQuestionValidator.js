import { validateTriviaQuestion } from '../validators/triviaQuestion.validation.js';

export const triviaQuestionValidator = (req, res, next) => {
  const { error } = validateTriviaQuestion(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      errors: error.details.map(err => err.message)
    });
  }
  next();
};
