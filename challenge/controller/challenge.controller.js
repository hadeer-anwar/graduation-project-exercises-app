import asyncWrapper from "../../middlewares/asyncWrapper.js";
import * as challengeService from "../service/challenge.service.js";

// Create challenge
export const createChallenge = asyncWrapper(async (req, res) => {
  const challenge = await challengeService.createChallenge(req.body);
  res.status(201).json({
    status: "success",
    data: challenge,
  });
});

// Update challenge
export const updateChallenge = asyncWrapper(async (req, res) => {
  const challenge = await challengeService.updateChallenge(
    req.params.id,
    req.body
  );
  res.status(200).json({
    status: "success",
    data: challenge,
  });
});

// Delete challenge
export const deleteChallenge = asyncWrapper(async (req, res) => {
  await challengeService.deleteChallenge(req.params.id);
  res.status(200).json({
    status: "success",
    message: "Challenge deleted successfully"
  });
});

// Get all challenges
export const getAllChallenges = asyncWrapper(async (req, res) => {
  const challenges = await challengeService.getAllChallenges();
  res.status(200).json({
    status: "success",
    results: challenges.length,
    data: challenges,
  });
});

// Get single challenge
export const getChallenge = asyncWrapper(async (req, res) => {
  const challenge = await challengeService.getChallengeById(req.params.id);
  res.status(200).json({
    status: "success",
    data: challenge,
  });
});