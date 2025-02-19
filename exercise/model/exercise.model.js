import mongoose from "mongoose";

const exerciseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true, 
      trim: true,
    },

    description: {
      type: String,
      required: true, 
      trim: true,
    },

    targetMuscles:[ {
      type: String,
      required: true,
    }],

    equipment: {
      type: String,
      enum: ["bodyweight", "dumbbell", "barbell", "machine", "resistance band"],
      default: "bodyweight",
    },

    difficulty: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      default: "beginner",
    },
   
    videoUrl: {type: String},
    
    imagesUrl: [
      {type: String}
    ]
  },
  {
    timestamps: true, 
  }
);

const Exercise = mongoose.model("Exercise", exerciseSchema);

export default Exercise;
