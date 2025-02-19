import appError from "../../utils/appError.js";
import Workout from "../model/workout.model.js";


// Create a new workout
 
export const createWorkout = async (data) => {

   const newWorkout = Workout.create(data);
   if(! newWorkout)
    throw new appError("Can't create new workout");
  return newWorkout;
};


 // Get all workouts

export const getAllWorkouts = async () => {
  const workoutList = await Workout.find(); 
  if(!workoutList)
    throw new appError("Can't get all workouts");
return workoutList;
};


 // Get a workout by ID

export const getWorkoutById = async (workoutId) => {
  const workout = await Workout.findById(workoutId);
  if(!workout) 
    throw new appError("Can't get workout");
};

// get workout by id and their exercise
export const getWorkoutByIdWithExercises = async (workoutId) => {
    const workout = await Workout.find(workoutId).populate("exercises"); // Populates exercises with their details
    if(!workout) 
      throw new appError("Can't get workout exercises");
  };



 //Update a workout

export const updateWorkout = async (id, data) => {
 const updatedWorkout = await Workout.findByIdAndUpdate(id, data, {new: true});
 if(!updatedWorkout)
    throw new appError("Can't update workout")
return updatedWorkout;
};


 // Delete a workout

export const deleteWorkout = async (workoutId) => {
  const deletedWorkout =  await Workout.findByIdAndDelete(workoutId);
  if(!deletedWorkout)
    throw new appError("Can't delete workout");
};
