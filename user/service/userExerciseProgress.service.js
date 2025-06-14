import UserExerciseProgress from "../model/userExerciseProgress.model.js";
import User from "../model/user.model.js";
import appError from "../../utils/appError.js";
import camelcaseKeys from "camelcase-keys";

export const createUserExerciseProgress = async (rawData) => {
  // Convert incoming snake_case keys to camelCase
  const data = camelcaseKeys(rawData, { deep: true });
  data.timeInSeconds = data.totalHoldTime;
  // ✅ Validate required fields
  if (!data.calcMethod || !["reps", "time"].includes(data.calcMethod)) {
    throw new appError("Invalid or missing calcMethod");
  }

  // ✅ Handle calcMethod specific logic
  if (data.calcMethod === "reps") {
    if (data.correctReps == null || data.incorrectReps == null) {
      throw new appError("Missing rep-based performance data");
    }
    if (data.detailedAnalysis) {
      data.detailedAnalysisReps = data.detailedAnalysis;
    }
  } else if (data.calcMethod === "time") {
    if (data.timeInSeconds == null) {
      throw new appError("Missing time-based performance data");
    }
    if (data.detailedAnalysis) {
      data.detailedAnalysisTime = data.detailedAnalysis;
    }
  }

  // 🧹 Clean temporary field
  delete data.detailedAnalysis;
  
  // ✅ Save progress to database
  const progress = await UserExerciseProgress.create(data);
  if (!progress) throw new appError("Can't store user exercise progress");

  // 🎯 Calculate points
  const pointsToAdd =
    data.calcMethod === "reps"
      ? data.correctReps
      : (data.totalHoldTime ?? data.timeInSeconds ?? 0) / 10;

  // ✅ Update user points
  await User.findByIdAndUpdate(data.userId, {
    $inc: { points: pointsToAdd },
  });

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
