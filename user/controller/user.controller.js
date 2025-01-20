import asyncWrapper from '../../middlewares/asyncWrapper.js';
import { addUser, userLogin } from '../service/user.service.js';

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


  export const userSignin = asyncWrapper(async (req, res , next) => {
    const {email, password} = req.body;
  const {user,token} = await userLogin(email, password);
    const tokenOption = {
      httpOnly: true,     // prevent xss attack
      secure: true,
      sameSite: 'Strict',   // prevent csrf attack
      maxAge: 7 * 24 * 60 * 60 * 1000, // Cookie valid for 7 days
    }
    res.status(200).cookie("token",token,tokenOption).json({
        success:true,
        message:"User Logged In",
        data:{
            user,
            token
        }
    })
  });