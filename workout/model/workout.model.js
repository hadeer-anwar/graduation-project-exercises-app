import mongoose from "mongoose";
import Exercise from "../../exercise/model/exercise.model";

const workoutSchema = new mongoose.Schema(
    {
        description: {
            type: String, 
            trim: true,
          },
        goal: {type: String},
        duration: {
            type: Number, // Duration in minutes
            required: true,
          },
          totalCaloriesBurned: {
            type: Number, 
          },
          exercises: [
            {
              type: mongoose.Schema.Types.ObjectId,
              ref: "Exercise", 
            },
          ],
    },
    {
        timestamps: true
    }
)

const Workout = mongoose.model("Workout", workoutSchema);

export default Workout;