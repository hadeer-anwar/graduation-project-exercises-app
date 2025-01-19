import mongoose from "mongoose";
import Workout from "../../workout/model/workout.model.js";

const challengeSchema = new mongoose.Schema(
    {
      title: { type: String, required: true },
      description: { type: String },
      difficulty: { type: String, enum: ["easy", "medium", "hard"], default: "easy" },
      points: { type: Number, default: 0 }, 
      workout:  [
                  { type: mongoose.Schema.Types.ObjectId, ref: "Workout" },
                ],
     
    }
  );
  
  const Challenge = mongoose.model("Challenge", challengeSchema);
  export default Challenge;
  