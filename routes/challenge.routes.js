import express from "express";
import {
  createChallenge,
  getAllChallenges,
  getChallengeById,
  updateChallenge,
  deleteChallenge
} from "../challenge/controller/challenge.controller.js";

const challengeRouter = express.Router();

challengeRouter.post("/create", createChallenge);
challengeRouter.get("/", getAllChallenges);
challengeRouter.get("/:challengeId", getChallengeById);
challengeRouter.put("/:challengeId", updateChallenge);
challengeRouter.delete("/:challengeId", deleteChallenge);

export default challengeRouter;
