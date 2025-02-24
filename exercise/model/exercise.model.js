import mongoose from "mongoose";
import Challenge from "../../challenge/model/challenge.model.js";
import UserChallenge from "../../challenge/model/userChallenge.model.js";

const exerciseSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },

    targetMuscles: [
      { type: String, required: true, minlength: 3 }
    ],
    secondaryMuscles: [
      { type: String, required: true, minlength: 3 }
    ],

    equipment: { type: String, default: "bodyweight" },
    difficulty: { type: String, default: "beginner" },

    videoUrl: [{ type: String }],
    imageUrl: [{ type: String }],

    workoutName: { type: String, required: true },
  },
  { timestamps: true }
);


exerciseSchema.pre("findOneAndDelete", async function (next) {
  const exerciseId = this.getQuery()._id;

  // Find challenges linked to this exercise
  const challenges = await Challenge.find({ exerciseId });

  if (challenges.length > 0) {
    const challengeIds = challenges.map(ch => ch._id);

    // Delete user challenge progress
    await UserChallenge.deleteMany({ challengeId: { $in: challengeIds } });

    // Delete challenges
    await Challenge.deleteMany({ exerciseId });
  }

  next();
});


const Exercise = mongoose.model("Exercise", exerciseSchema);
export default Exercise;
