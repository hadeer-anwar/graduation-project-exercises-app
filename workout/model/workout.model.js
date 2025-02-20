import mongoose from "mongoose";

const workoutSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, minlength: 3, maxlength: 100 },
    description: { type: String, trim: true, maxlength: 300 },
    imageUrl: [{type: String}],
    exercises: [{type: mongoose.Types.ObjectId,
      ref: 'Exercise'
    }],
  },
  { timestamps: true }
);

const Workout = mongoose.model("Workout", workoutSchema);
export default Workout;

