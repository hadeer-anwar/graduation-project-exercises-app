import express from "express";
import { createExercise, getAllExercises, getExerciseById, updateExercise, deleteExercise } from "../exercise/controller/exercise.controller.js";
import { exerciseValidator } from "../middlewares/exerciseValidator.js";

const exerciseRouter = express.Router();

exerciseRouter.post("/create", exerciseValidator, createExercise);
exerciseRouter.get("/", getAllExercises);
exerciseRouter.get("/:id", getExerciseById);
exerciseRouter.put("/:id", exerciseValidator, updateExercise);
exerciseRouter.delete("/:id", deleteExercise);

export default exerciseRouter;
