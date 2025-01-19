import asyncWrapper from '../../middlewares/asyncWrapper.js';
import { addUser } from '../service/user.service.js';

export const userSignup= asyncWrapper(async(req,res,next) => {
    const user= {
      name:req.body.name,
      email:req.body.email,
      password:req.body.password,
      googleId:req.body.googleId,
      profilePic: req.body.profilePic,
      age: req.body.age,
      height:req.body.height,
      weight: req.body.weight,
      fitnessGoal: req.body.fitnessGoal,
      activityLevel: req.body.activityLevel,
      achievements: req.body.achievements,
      workoutHistory: req.body.workoutHistory,
    }
    await addUser(user);
    res.status(201).json({
      data: user,
      success: true,
      error:false,
      message: 'User registered successfully'
    });
  })