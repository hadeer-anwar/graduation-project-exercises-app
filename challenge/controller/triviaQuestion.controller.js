// controllers/triviaQuestion.controller.js
import asyncWrapper from "../../middlewares/asyncWrapper.js";
import * as triviaQuestionService from "../service/triviaQuestion.service.js";

export const createQuestion = asyncWrapper(async (req, res) => {
  const question = await triviaQuestionService.createTriviaQuestion(req.body);
  res.status(201).json({
    status: "success",
    data: question
  });
});

export const getQuestions = asyncWrapper(async (req, res) => {
  const questions = await triviaQuestionService.getTriviaQuestions(req.query);
  res.status(200).json({
    status: "success",
    results: questions.length,
    data: questions
  });
});

export const getQuestion = asyncWrapper(async (req, res) => {
  const question = await triviaQuestionService.getTriviaQuestionById(req.params.id);
  res.status(200).json({
    status: "success",
    data: question
  });
});

export const updateQuestion = asyncWrapper(async (req, res) => {
  console.log(req.params.id)
  const question = await triviaQuestionService.updateTriviaQuestion(
    req.params.id,
    req.body
  );
  res.status(200).json({
    status: "success",
    data: question
  });
});

export const deleteQuestion = asyncWrapper(async (req, res) => {
  await triviaQuestionService.deleteTriviaQuestion(req.params.id);
  res.status(204).json({
    status: "Qsuccess",
    message: "Question deleted successfully"
  });
});