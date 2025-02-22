import * as challengeService from "../service/challenge.service.js";
import asyncWrapper from "../../middlewares/asyncWrapper.js";

// ✅ Create a new challenge
export const createChallenge = asyncWrapper(async (req, res, next) => {
  const { challengeType, 
          description, 
          requiredDays,
          dailyTarget, 
          exercises, 
          pointsPerDay, 
          totalPoints, 
          lastUpdated,
          streakDays,
        completedDays } = req.body;

  const challenge = await challengeService.createChallenge({
    challengeType,
    description,
    requiredDays,
    dailyTarget,
    exercises,
    pointsPerDay,
    totalPoints,
    lastUpdated,
    streakDays,
    completedDays
  });

  res.status(201).json({
    success: true,
    message: "Challenge created successfully",
    data: challenge,
  });
});

// ✅ Get all challenges
export const getAllChallenges = asyncWrapper(async (req, res, next) => {
  const challenges = await challengeService.getAllChallenges();
  res.status(200).json({
    success: true,
    message: "All challenges",
    data: challenges,
  });
});

// ✅ Get challenge by ID
export const getChallengeById = asyncWrapper(async (req, res, next) => {
  const { challengeId } = req.params;
  const challenge = await challengeService.getChallengeById(challengeId);
  res.status(200).json({
    success: true,
    message: "Challenge details",
    data: challenge,
  });
});

// ✅ Update a challenge
export const updateChallenge = asyncWrapper(async (req, res, next) => {
  const { challengeId } = req.params;
  const updatedChallenge = await challengeService.updateChallenge(challengeId, req.body);
  res.status(200).json({
    success: true,
    message: "Challenge updated successfully",
    data: updatedChallenge,
  });
});

// ✅ Delete a challenge
export const deleteChallenge = asyncWrapper(async (req, res, next) => {
  const { challengeId } = req.params;
  await challengeService.deleteChallenge(challengeId);
  res.status(200).json({
    success: true,
    message: "Challenge deleted successfully",
  });
});

export const updateUserChallenge = asyncWrapper(async (req, res, next) => {
  const { userId, challengeId, completedReps } = req.body;

  const progress = await challengeService.updateChallengeProgress(userId,challengeId,completedReps)

  res.status(200).json({
    success: true,
    message: "Challenge progress updated successfully",
    data: progress,
  });
});