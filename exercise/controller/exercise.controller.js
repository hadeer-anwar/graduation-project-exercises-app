import asyncWrapper from "../../middlewares/asyncWrapper.js";
import * as exerciseService from "../service/exercise.service.js";

export const createExercise = asyncWrapper(async(req,res,next)=>{
    const data = {
       name: req.body.name,
       description: req.body.description,
       targetMuscles: req.body.targetMuscles,
       equipment: req.body.equipment,
       difficulty: req.body.difficulty,
       videoUrl : req.body.videoUrl,
       imgUrl: req.body.imgUrl
    }

    const exercise = await exerciseService.createExercise(data);

    res.status(201).json({
        success: true,
        message: "Exercise created successfully",
        data: exercise
    })
})



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

export const updateExercise = asyncWrapper(async (req, res) => {

  const updatedExercise = await exerciseService.updateExercise(req.params.id, req.body);
  res.status(200).json({
    success: true,
    message: "Exercise updated successfully",
    data: updatedExercise
})
});

export const deleteExercise = asyncWrapper(async (req, res) => {
  await exerciseService.deleteExercise(req.params.id);
  res.status(200).json({
    success: true,
    message: "Exercise deleted successfully",
    data: ""
})

});
