import mongoose from "mongoose";
import Exercise from "../../exercise/model/exercise.model.js";

const workoutSchema = new mongoose.Schema(
    {
      name: {
        type: String, 
        required: true,
      },
        description: {
            type: String, 
            trim: true,
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