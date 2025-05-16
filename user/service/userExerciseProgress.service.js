import UserExerciseProgress from "../model/userExerciseProgress.model.js";
import User from "../model/user.model.js";
import appError from "../../utils/appError.js";

export const createUserExerciseProgress = async (data) => {
  // Save progress entry
  const progress = await UserExerciseProgress.create(data);
  
  if(!progress) throw new appError("can't store user exercise progress")
 if(data.calcMethod === "reps")
  await User.findByIdAndUpdate(data.userId, {
    $inc: { points: data.correctReps }, 
  });
 else {
   await User.findByIdAndUpdate(data.userId, {
    $inc: { points: 10*(data.timeInSeconds/10) }, 
  });

  }

  return progress;
};

export const getUserProgressByUserId = async (userId) => {
  return await UserExerciseProgress.find({ userId }).populate('exerciseId');
};

export const getExerciseProgress = async (exerciseId) => {
  return await UserExerciseProgress.find({ exerciseId }).populate('userId');
};

export const getAllProgress = async () => {
  return await UserExerciseProgress.find().populate('userId').populate('exerciseId');
};
