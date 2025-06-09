import asyncWrapper from "../../middlewares/asyncWrapper.js";
import * as exerciseService from "../service/exercise.service.js";


export const createExercise = asyncWrapper(async (req, res, next) => {
  
  const imageUrl = req.files?.image ? req.files.image[0].path : "";
  const videoUrl = req.files?.video ? req.files.video[0].path : "";
  
  const data = {
    name: req.body.name,
    description: req.body.description,
    targetMuscles: req.body.targetMuscles, 
    secondaryMuscles: req.body.secondaryMuscles,
    equipment: req.body.equipment || "bodyweight",
    difficulty: req.body.difficulty || "beginner",
    imageUrl, 
    videoUrl: videoUrl ? [videoUrl] : [], 
    workoutName: req.body.workoutName
  };
  
  const exercise = await exerciseService.createExercise(data);

  res.status(201).json({
    success: true,
    message: "Exercise created successfully",
    data: exercise,
  });
});




export const getAllExercises = asyncWrapper(async (req, res) => {
  const exercises = await exerciseService.getAllExercises();
  res.status(200).json({
    success: true,
    message: "All Exercises",
    data: exercises
})
});

export const getExerciseById = asyncWrapper(async (req, res) => {
  const exercise = await exerciseService.getExerciseById(req.params.id);
  res.status(200).json({
    success: true,
    message: "Exercise",
    data: exercise
})
});

export const updateExercise = asyncWrapper(async (req, res , next) => {
  // Process uploaded files
  const imageUrl = req.files?.image ? req.files.image[0].path : undefined;
  const videoUrl = req.files?.video ? req.files.video[0].path : undefined;

  // Prepare update data
  const updateData = {
    ...req.body,
    ...(imageUrl && { imageUrl: [imageUrl] }), // Only add if image exists
    ...(videoUrl && { videoUrl: [videoUrl] })  // Only add if video exists
  };

  const updatedExercise = await exerciseService.updateExercise(req.params.id, updateData);
  
  res.status(200).json({
    success: true,
    message: "Exercise updated successfully",
    data: updatedExercise
  });
});

export const deleteExercise = asyncWrapper(async (req, res) => {
  await exerciseService.deleteExercise(req.params.id);
  res.status(200).json({
    success: true,
    message: "Exercise deleted successfully",
    data: ""
})

});
