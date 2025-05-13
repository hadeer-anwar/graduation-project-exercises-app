
import mongoose from "mongoose";

// Base Challenge Schema
const challengeSchema = new mongoose.Schema({
  type: { 
    type: String, 
    enum: ["exercise", "trivia"], 
    required: true 
  },
  points: { 
    type: Number, 
    default: 10 
  },
  // Shared metadata
  content: { 
    type: String, 
    required: true 
  },

}, { 
  timestamps: true,
  discriminatorKey: "type" // Critical for inheritance
});

// Base Model
const Challenge = mongoose.model("Challenge", challengeSchema);

// Exercise Challenge Discriminator
const ExerciseChallenge = Challenge.discriminator("exercise", 
  new mongoose.Schema({
    exerciseId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Exercise",
      required: true 
    },
    calcMethod: {
      type: String, 
      enum: ["reps", "time"],
      required: true 
    },
    target: { 
      type: Number 
    },

  })
);

// Trivia Challenge Discriminator
const TriviaChallenge = Challenge.discriminator("trivia", 
  new mongoose.Schema({
    questionId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "TriviaQuestion",
      required: true 
    },
    timeLimit: { 
      type: Number, 
      default: 30 // Seconds to answer
    }
  })
);

export default Challenge;