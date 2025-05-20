import express from 'express';
import {
  createQuestion,
  getQuestions,
  getQuestion,
  updateQuestion,
  deleteQuestion
} from '../challenge/controller/triviaQuestion.controller.js';
import { triviaQuestionValidator } from '../middlewares/triviaQuestionValidator.js';
const triviaQuestionRouter = express.Router();


triviaQuestionRouter.route('/createTriviaQuestion').post(triviaQuestionValidator, createQuestion)
triviaQuestionRouter.route('/getTriviaQuestions').get(getQuestions);


triviaQuestionRouter.route('/:id')
  .get(getQuestion)
  .put(updateQuestion)
  .delete(deleteQuestion);

export default triviaQuestionRouter;