import mongoose from "mongoose";

const userChallengeProgressSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  sessionId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Session", 
    required: true 
  },
  // Stores ALL challenges in the session + user's progress for each
  challenges: [{
    challengeId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Challenge", 
      required: true 
    },
    completed: { type: Boolean, default: false },
    score: { type: Number, default: 0 }, // Points for this specific challenge
  }],
  totalScore: { type: Number, default: 0 }, // Sum of all challenge scores
}, { timestamps: true });

export default mongoose.model("UserChallengeProgress", userChallengeProgressSchema);