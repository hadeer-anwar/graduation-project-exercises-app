import * as challengeService from "../service/challenge.service.js";
import asyncWrapper from "../../middlewares/asyncWrapper.js";

// Create new challenge

export const createChallenge = asyncWrapper(async (req, res, next) => {
  const data = {
    challengeType: req.body.challengeType,
    target: req.body.target,
    points: req.body.points,
    exercise: req.body.exercise
  };
  const challenge = await challengeService.createChallenge(data);
  res.status(201).json({
    success: true,
    message: "Challenge created successfully",
    data: challenge,
  });
});

// Get all challenges

export const getAllChallenges = asyncWrapper(async (req, res, next) => {
  const challenges = await challengeService.getAllChallenges();
  res.status(200).json({
    success: true,
    message: "All Challenges",
    data: challenges,
  });
});

// Get challenge by ID

export const getChallengeById = asyncWrapper(async (req, res, next) => {
  const { challengeId } = req.params;
  const challenge = await challengeService.getChallengeById(challengeId);
  res.status(200).json({
    success: true,
    message: "Challenge details",
    data: challenge,
  });
});

// Update challenge

export const updateChallenge = asyncWrapper(async (req, res, next) => {
  const { challengeId } = req.params;
  const data = req.body;
  const updatedChallenge = await challengeService.updateChallenge(challengeId, data);
  res.status(200).json({
    success: true,
    message: "Challenge updated successfully",
    data: updatedChallenge,
  });
});

// Delete challenge

export const deleteChallenge = asyncWrapper(async (req, res, next) => {
  const { challengeId } = req.params;
  const deletedChallenge = await challengeService.deleteChallenge(challengeId);
  res.status(200).json({
    success: true,
    message: "Challenge deleted successfully",
    data: deletedChallenge,
  });
});
