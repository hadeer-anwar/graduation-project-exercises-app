import Challenge from "../model/challenge.model.js";
import Exercise from "../../exercise/model/exercise.model.js";
import TriviaQuestion from "../model/triviaQuestion.model.js";
import appError from "../../utils/appError.js";

// Create a new challenge (auto-handles exercise/trivia types)
export const createChallenge = async (data) => {

  // Create the challenge (Mongoose handles discriminator automatically)
  const challenge = await Challenge.create(data);
  return challenge;
};

// Update a challenge
export const updateChallenge = async (id, updateData) => {
  const challenge = await Challenge.findById(id);
  if (!challenge) throw appError("Challenge not found", 404);

  // Prevent type change after creation
  if (updateData.type && updateData.type !== challenge.type) {
    throw appError("Cannot change challenge type after creation", 400);
  }

  // Exercise-specific updates
  if (challenge.type === "exercise" && updateData.exerciseId) {
    const exercise = await Exercise.findById(updateData.exerciseId);
    if (!exercise) throw appError("Exercise not found", 404);
  }

  // Trivia-specific updates
  if (challenge.type === "trivia" && updateData.questionId) {
    const question = await TriviaQuestion.findById(updateData.questionId);
    if (!question) throw appError("Trivia question not found", 404);
  }

  const updatedChallenge = await Challenge.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });
  console.log("update data ",updateData)
  if(!updatedChallenge) throw new appError("can't update challenge")
  return updatedChallenge;
};

// Delete a challenge
export const deleteChallenge = async (id) => {
  const challenge = await Challenge.findByIdAndDelete(id);
  if (!challenge) throw appError("Challenge not found", 404);
  return challenge;
};

// Get all challenges (both types)
export const getAllChallenges = async (filter = {}) => {
  return Challenge.find(filter).populate({
    path: "exerciseId questionId",
    select: "name question", // Only get essential fields
  });
};

// Get challenge by ID
export const getChallengeById = async (id) => {
  const challenge = await Challenge.findById(id).populate({
    path: "exerciseId questionId",
    select: "name question description",
  });
  if (!challenge) throw appError("Challenge not found", 404);
  return challenge;
};