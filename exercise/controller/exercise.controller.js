import asyncWrapper from "../../middlewares/asyncWrapper";
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