import express from "express";
import {
  createChallenge,
  getAllChallenges,
  getChallengeById,
  updateChallenge,
  deleteChallenge,
  updateUserChallenge,
} from "../controller/challenge.controller.js";
import { challengeValidator } from "../middlewares/challengeValidator.js";

const challengeRouter = express.Router();

// ✅ Create a new challenge
challengeRouter.post("/", challengeValidator, createChallenge);

// ✅ Get all challenges
challengeRouter.get("/", getAllChallenges);

// ✅ Get a challenge by ID
challengeRouter.get("/:challengeId", getChallengeById);

// ✅ Update a challenge
challengeRouter.put("/:challengeId", challengeValidator, updateChallenge);

// ✅ Delete a challenge
challengeRouter.delete("/:challengeId", deleteChallenge);

challengeRouter.put("/challenge-progress",updateUserChallenge )
export default challengeRouter;
