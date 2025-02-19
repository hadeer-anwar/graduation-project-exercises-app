import express from "express";
import { createWorkout,
         getAllWorkouts,
         getWorkoutById,
         updateWorkout, 
         deleteWorkout, 
         getWorkoutByIdWithExercises } from "../workout/controller/workout.controller.js";


const workoutRouter = express.Router();

workoutRouter.post("/create", createWorkout);
workoutRouter.get("/", getAllWorkouts);
workoutRouter.get("/:workoutId", getWorkoutById);
workoutRouter.get("/workout-exercises/:workoutId", getWorkoutByIdWithExercises)
workoutRouter.put("/:workoutId", updateWorkout);
workoutRouter.delete("/:workoutId", deleteWorkout);

export default workoutRouter;
