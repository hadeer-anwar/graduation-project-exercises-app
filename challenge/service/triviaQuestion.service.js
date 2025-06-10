// services/triviaQuestion.service.js
import TriviaQuestion from "../model/triviaQuestion.model.js";
import Challenge from '../../challenge/model/challenge.model.js'
import appError from '../../utils/appError.js'
import mongoose from "mongoose";

const TriviaChallenge = mongoose.model("trivia");

export const createTriviaQuestion = async (data) => {
  const question = await TriviaQuestion.create(data);
  if (!question) {
    throw new appError("Can't create question");
  }

  // Create associated trivia challenge
  const challenge = await TriviaChallenge.create({
    type: "trivia",
    questionId: question._id,
    points: question.points, // Use same points as question
    content: question.question, // Optional: store question text for easier access
    timeLimit: data.timeLimit || 30, // Optional: override or use default
  });

  if (!challenge) {
    throw new appError("Failed to create associated challenge");
  }

  return { question, challenge };
};


export const getTriviaQuestions = async (filter = {}) => {
  const questions = await TriviaQuestion.find(filter);
  if(!questions)
    throw new appError("can't get questions")
  return questions;
};

export const getTriviaQuestionById = async (id) => {
  const question = await TriviaQuestion.findById(id);
  if (!question) throw new appError("Trivia question not found", 404);
  return question;
};

export const updateTriviaQuestion = async (id, updateData) => {
  if (updateData.options && updateData.correctAnswer && 
      !updateData.options.includes(updateData.correctAnswer)) {
    throw new appError("Correct answer must be one of the options", 400);
  }

  const updatedQuestion = await TriviaQuestion.findByIdAndUpdate(id, updateData, {
    new: true
  });
  console.log("trivia",updatedQuestion)
  if(!updatedQuestion) throw new appError("can't update question")
  return updatedQuestion;
};

export const deleteTriviaQuestion = async (id) => {
  const question = await TriviaQuestion.findByIdAndDelete(id);
  if (!question) throw appError("Trivia question not found", 404);
  
  // Optional: Remove any challenges that reference this question
  await Challenge.deleteMany({ 
    type: "trivia", 
    questionId: id 
  });
  
  return question;
};