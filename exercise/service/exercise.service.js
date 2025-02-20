import appError from "../../utils/appError";
import Exercise from "../model/exercise.model.js"


export const createExercise = async (data)=>{

  const newExercise = Exercise.create(data);
  if(! newExercise)
    throw new appError("Couldn't create exercise")

  return newExercise

}