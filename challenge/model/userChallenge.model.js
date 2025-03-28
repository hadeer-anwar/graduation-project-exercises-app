const mongoose = require('mongoose');

const userChallengeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  challengeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Challenge',
    required: true
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  completedDays: [{
    date: Date,
    isCompleted: Boolean,
    repsCompleted: Number
  }],
  currentStreak: {
    type: Number,
    default: 0
  },
  longestStreak: {
    type: Number,
    default: 0
  },
  isCompleted: {
    type: Boolean,
    default: false
  },
  lastUpdated: Date
}, { timestamps: true });

// Index for faster queries
userChallengeSchema.index({ userId: 1, challengeId: 1 }, { unique: true });

module.exports = mongoose.model('UserChallenge', userChallengeSchema);