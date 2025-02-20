import express from "express";
import {
  createChallenge,
  getAllChallenges,
  getChallengeById,
  updateChallenge,
  deleteChallenge
} from "../challenge/controller/challenge.controller.js";
import { challengeValidator } from "../middlewares/challengeValidator.js";
const challengeRouter = express.Router();

challengeRouter.post("/create",challengeValidator, createChallenge);
challengeRouter.get("/", getAllChallenges);
challengeRouter.get("/:challengeId", getChallengeById);
challengeRouter.put("/:challengeId",challengeValidator, updateChallenge);
challengeRouter.delete("/:challengeId", deleteChallenge);

export default challengeRouter;
