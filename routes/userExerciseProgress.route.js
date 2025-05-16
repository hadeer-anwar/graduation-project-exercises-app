import express from "express";
import { createProgress, getAllProgress, getExerciseProgress, getUserProgress } from "../user/controller/userExerciseProgress.controller.js";

const userExerciseProgressRouter = express.Router();

userExerciseProgressRouter.post("/create", createProgress)
userExerciseProgressRouter.get("/all", getAllProgress)
userExerciseProgressRouter.get("/user/:userId", getUserProgress)
userExerciseProgressRouter.get("/exercise/:exerciseId", getExerciseProgress)


export default userExerciseProgressRouter;