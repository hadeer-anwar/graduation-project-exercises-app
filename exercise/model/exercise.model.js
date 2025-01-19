import mongoose from "mongoose";

const exerciseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true, 
      trim: true,
    },
    targetMuscle: {
      type: String,
      enum: ["chest", "back", "legs", "arms", "shoulders", "core"],
      required: true, // Primary muscle targeted
    },
    equipment: {
      type: String,
      enum: ["bodyweight", "dumbbell", "barbell", "machine", "resistance band"],
      default: "bodyweight",
    },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "medium",
    },
    caloriesPerRep: {
      type: Number, // Calories burned per repetition (approximation)
      default: 0,
    },
    videoTutorial: {type: String},
  },
  {
    timestamps: true, 
  }
);

const Exercise = mongoose.model("Exercise", exerciseSchema);

export default Exercise;
