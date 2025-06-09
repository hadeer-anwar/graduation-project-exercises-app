import appError from "../../utils/appError.js";
import Workout from "../../workout/model/workout.model.js";
import Exercise from "../model/exercise.model.js"


export const createExercise = async (data) => {
  const { workoutName } = data;
  const workout = await Workout.findOne({ name: workoutName });
  if (!workout) 
    throw appError("Workout not found");
  
  const newExercise = await Exercise.create(data);
  if (!newExercise)
     throw appError("Couldn't create exercise");

  workout.exercises.push(newExercise._id);
  await workout.save();

  return newExercise;
};


// get all exercises 
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
  // Find the current exercise
  const existingExercise = await Exercise.findById(id);
  if (!existingExercise) {
    throw new appError("Exercise not found");
  }

  // Check if workoutName is being updated
  if (updateData.workoutName && updateData.workoutName !== existingExercise.workoutName) {
    // Find the old workout and remove the exercise from its exercises array
    await Workout.findOneAndUpdate(
      { workoutName: existingExercise.workoutName },
      { $pull: { exercises: id } }
    );

    // Find the new workout and add the exercise to its exercises array
    await Workout.findOneAndUpdate(
      { workoutName: updateData.workoutName },
      { $push: { exercises: id } },
      { new: true, runValidators: true }
    );
  }

   const updatedExercise = await Exercise.findByIdAndUpdate(
    id, 
    updateData, 
    { new: true, runValidators: true }
  );

  if (!updatedExercise) {
    throw new appError("Exercise update failed");
  }

  return updatedExercise;
};



export const deleteExercise = async (id) => {
  const exercise = await Exercise.findByIdAndDelete(id);
  if (!exercise) {
    throw new appError("Exercise not found");
  }

  // Remove exercise ID from the associated workout
  await Workout.updateMany(
    { exercises: id }, 
    { $pull: { exercises: id } }
  );

  return exercise;
};

