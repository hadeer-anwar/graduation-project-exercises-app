import mongoose from "mongoose";


const ChallengeSchema = new mongoose.Schema(
  {
    challengeType: { type: String, required: true },
    description: { type: String },
    requiredDays: { type: Number, required: true }, 
    dailyTarget: { type: Number, required: true }, 
    pointsPerDay: { type: Number, default: 10 }, 
    totalPoints: { type: Number }, 
    exercise: { type: mongoose.Schema.Types.ObjectId, ref: 'Exercise' },
    lastUpdated: { type: Date } ,
    streakDays: { type: Number, min: 0, default: 0 },  
    completedDays: { type: Number, min: 0, default: 0 }, 
  },
  { timestamps: true }
);

ChallengeSchema.pre("save", function (next) {
  this.totalPoints = this.requiredDays * this.pointsPerDay;
  next();
});

const Challenge = mongoose.model("Challenge", ChallengeSchema);
export default Challenge;

