import express from "express";
import { createWorkout,
         getAllWorkouts,
         getWorkoutById,
         updateWorkout, 
         deleteWorkout, 
         getWorkoutByIdWithExercises,
        getAllWorkoutNames } from "../workout/controller/workout.controller.js";
import { workoutValidator } from "../middlewares/workoutValidator.js";
import { uploadFiles } from "../cloudinary/cloudinaryConfig.js";


const workoutRouter = express.Router();

workoutRouter.post(
    "/create", 
    uploadFiles.fields([
    { name: "image", maxCount: 1 },
    { name: "video", maxCount: 1 },
  ]),
  workoutValidator, 
  createWorkout);

workoutRouter.get("/", getAllWorkouts);
workoutRouter.get("/list/names",getAllWorkoutNames)
workoutRouter.get("/:workoutId", getWorkoutById);
workoutRouter.get("/workout-exercises/:workoutId", getWorkoutByIdWithExercises)


workoutRouter.put("/:workoutId",  uploadFiles.fields([
    { name: "image", maxCount: 1 },
    { name: "video", maxCount: 1 },
  ]),workoutValidator, updateWorkout);
  
workoutRouter.delete("/:workoutId", deleteWorkout);

export default workoutRouter;
