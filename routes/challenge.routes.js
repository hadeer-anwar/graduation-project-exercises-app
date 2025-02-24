import express from "express";
import {
  createChallenge,
  getAllChallenges,
  getChallengeById,
  updateChallenge,
  deleteChallenge,
} from "../challenge/controller/challenge.controller.js";
import { challengeValidator } from "../middlewares/challengeValidator.js";

const challengeRouter = express.Router();

//  Create a new challenge
challengeRouter.post("/", challengeValidator, createChallenge);

//  Get all challenges
challengeRouter.get("/", getAllChallenges);

//  Get a challenge by ID
challengeRouter.get("/:challengeId", getChallengeById);

//  Update a challenge
challengeRouter.put("/:challengeId", challengeValidator, updateChallenge);

//  Delete a challenge
challengeRouter.delete("/:challengeId", deleteChallenge);




export default challengeRouter;
