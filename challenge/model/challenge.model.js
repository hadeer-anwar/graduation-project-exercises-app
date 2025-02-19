import mongoose from "mongoose";

const ChallengeSchema = new mongoose.Schema(
  {
 
  challengeType: { 
    type: String,
    required: true },
  description:{
    type: String,
  },

  target: {
     type: Number,
     required: true }, // e.g., 3 days, 100 reps, 10 miles

  points: {
    type: Number,
    default: 0 
  },

  exercise: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exercise'
   },
},
{
  timestamps: true,
});
const Challenge = mongoose.model("Challenge", ChallengeSchema);
export default Challenge;
