import mongoose from "mongoose";

const triviaQuestionSchema = new mongoose.Schema({
  // Core Question Data
  question: { 
    type: String, 
    required: true,
    trim: true
  },

  // Answer Options
  options: {
    type: [String],
    required: true,
    validate: {
      validator: (arr) => arr.length >= 2 && arr.length <= 4, // 2-4 options
      message: "Provide 2-4 answer options"
    }
  },
  correctAnswer: {
    type: String,
    required: true,
  },

  // Scoring
  points: {
    type: Number,
    default: 10,
  },

}, { 
  timestamps: true,

});



export default mongoose.model("TriviaQuestion", triviaQuestionSchema);