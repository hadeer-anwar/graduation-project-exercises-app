import express from "express";
import { createExercise, getAllExercises, getExerciseById, updateExercise, deleteExercise } from "../exercise/controller/exercise.controller.js";
import { exerciseValidator } from "../middlewares/exerciseValidator.js";

import { uploadFiles } from "../cloudinary/cloudinaryConfig.js";

const exerciseRouter = express.Router();

exerciseRouter.post(
  "/create",
  uploadFiles.fields([
    { name: "image", maxCount: 1 },
    { name: "video", maxCount: 1 },
  ]),
  exerciseValidator,
  createExercise
);

exerciseRouter.get("/", getAllExercises);
exerciseRouter.get("/:id", getExerciseById);
exerciseRouter.put("/:id", exerciseValidator, updateExercise);
exerciseRouter.delete("/:id", deleteExercise);

export default exerciseRouter;
