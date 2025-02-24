import mongoose from "mongoose";

const UserChallengeSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    challengeId: { type: mongoose.Schema.Types.ObjectId, ref: "Challenge", required: true },
    status: { type: String, enum: ["active", "completed", "exited"], default: "active" },
    lastUpdated: { type: Date } ,
    streakDays: { type: Number, min: 0, default: 0 },  
    completedDays: { type: Number, min: 0, default: 0 }, 
    
  });
  
  const UserChallenge = mongoose.model("UserChallenge", UserChallengeSchema);
  export default UserChallenge;
  