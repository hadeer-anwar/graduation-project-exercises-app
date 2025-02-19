import mongoose from "mongoose";

const ChallengeSchema = new mongoose.Schema(
  {
 
  challengeType: { 
    type: String,
    enum: ["days_per_week", "exercise_reps", "run_distance"],
    required: true },

  target: {
     type: Number,
     required: true }, // e.g., 3 days, 100 reps, 10 miles

  points: {
    type: Number,
    default: 0 
  },

  exerciseType: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exercise'
   },
},
{
  timestamps: true,
});
const Challenge = mongoose.model("Challenge", ChallengeSchema);
export default Challenge;
