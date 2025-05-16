import asyncWrapper from '../../middlewares/asyncWrapper.js';
import * as userExerciseProgressService from '../service/userExerciseProgress.service.js';

export const createProgress = asyncWrapper( async (req, res) => {

    const progress = await userExerciseProgressService.createUserExerciseProgress(req.body);

    res.status(201).json({ 
         success: true,
         message: 'Progress recorded successfully', 
         progress });
    }
);

export const getUserProgress = asyncWrapper( async (req,res)=>{
     const userId = req.params.userId;
    const progress = await userExerciseProgressService.getUserProgressByUserId(userId);
    res.status(200).json({
        success:true,
        progress
    });
})

export const getExerciseProgress = asyncWrapper( async (req,res)=>{
     const exerciseId = req.params.exerciseId;
    const progress = await userExerciseProgressService.getExerciseProgress(exerciseId);
    res.status(200).json({
        success:true,
        progress
    });
})

export const getAllProgress = asyncWrapper( async (req, res)=> {
      const progress = await userExerciseProgressService.getAllProgress();
      res.status(200).json({
        success:true,
        progress
    });
})
