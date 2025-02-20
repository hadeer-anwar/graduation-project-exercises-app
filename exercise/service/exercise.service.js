import appError from "../../utils/appError.js";
import Exercise from "../model/exercise.model.js"


export const createExercise = async (data)=>{

  const newExercise = Exercise.create(data);
  if(! newExercise)
    throw new appError("Couldn't create exercise")

  return newExercise

}

export const getAllExercises = async () => {
  const allExercises = await Exercise.find();

  if(!allExercises)
    throw new appError("Couldn't get all exercises")
  return allExercises;
};

export const getExerciseById = async (id) => {
  const exercise = await Exercise.findById(id);
  if (!exercise) {
    throw new appError("Exercise not found");
  }
  return exercise;
};

export const updateExercise = async (id, updateData) => {
  const updatedExercise = await Exercise.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
  if (!updatedExercise) {
    throw new appError("Exercise not found");
  }
  return updatedExercise;
};

export const deleteExercise = async (id) => {
  const exercise = await Exercise.findByIdAndDelete(id);
  if (!exercise) {
    throw new appError("Exercise not found");
  }
  return exercise;
};
