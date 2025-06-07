import * as workoutService from "../service/workout.service.js";
import asyncWrapper from '../../middlewares/asyncWrapper.js'
import { validateWorkout } from "../../validators/workout.validation.js";
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
// Update workout - Modified to handle both JSON and form-data
export const updateWorkout = asyncWrapper(async (req, res, next) => {
    const { workoutId } = req.params;
    
    // Handle both JSON and form-data
    const workoutData = req.file ? {
        ...req.body,
        imageUrl: req.file.path
    } : req.body;

    // Validate input
    const { error } = validateWorkout(workoutData);
    if (error) {
        const errors = error.details.map(detail => detail.message);
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors
        });
    }

    const updatedWorkout = await workoutService.updateWorkout(workoutId, workoutData);
    res.status(200).json({
        success: true,
        message: "Workout updated successfully",
        data: updatedWorkout
    });
});

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

