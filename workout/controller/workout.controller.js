import * as workoutService from "../service/workout.service.js";
import asyncWrapper from '../../middlewares/asyncWrapper.js'
// Create a new workout

export const createWorkout = asyncWrapper( async (req, res, next)=>{
    const imageUrl = req.files?.image ? req.files.image[0].path : "";
    const data = {
        name: req.body.name,
        description: req.body.description,
        exercises: req.body.exercises,
        imageUrl
    }
    const workout = await workoutService.createWorkout(data);
    res.status(201).json({
        success:true,
        message:"Workout Created successfully ",
        data:workout
    })

})


// Get all workouts
export const getAllWorkouts = asyncWrapper( async (req, res, next)=>{
    const workouts = await workoutService.getAllWorkouts();
    res.status(200).json({
        success:true,
        message:"All Workouts retrieved successfully",
        data:workouts
    })
})



//  Get workout by ID
export const getWorkoutById = asyncWrapper( async (req, res, next)=>{
    const { workoutId } = req.params;
    const workout = await workoutService.getWorkoutById(workoutId);
    res.status(200).json({
        success:true,
        message:"",
        data:workout
    })
})

// get exercises for specific workout 
export const getWorkoutByIdWithExercises = asyncWrapper( async (req, res, next)=>{
    const { workoutId } = req.params;
    const workout = await workoutService.getWorkoutByIdWithExercises(workoutId);
    res.status(200).json({
        success:true,
        message:"Exercises for specific workout",
        data:workout
    })
})

// Update workout
export const updateWorkout = asyncWrapper(async (req,res, next)=>{
    const { workoutId } = req.params;
    const workoutData = req.body;
    const updatedWorkout = await workoutService.updateWorkout(workoutId, workoutData);
    res.status(200).json({
        success:true,
        message:"workout updataed successfully",
        data:updatedWorkout
    })
})

// Delete workout
export const deleteWorkout = asyncWrapper(async (req, res, next)=>{
    const { workoutId } = req.params;
    const deletedWorkout = await workoutService.deleteWorkout(workoutId);
    res.status(200).json({
        success:true,
        message:"workout deleted successfully",
        data:deletedWorkout
    })
})

