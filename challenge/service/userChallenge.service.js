const UserChallenge = require('../models/UserChallenge');
const Challenge = require('../models/Challenge');
const User = require('../models/User');

// Start a new challenge for a user
exports.startChallenge = async (userId, challengeId) => {
  // Check if user already has this challenge
  const existingUserChallenge = await UserChallenge.findOne({ 
    userId, 
    challengeId 
  });
  
  if (existingUserChallenge) {
    throw new Error('User already has this challenge');
  }
  
  const challenge = await Challenge.findById(challengeId);
  if (!challenge) {
    throw new Error('Challenge not found');
  }
  
  // Initialize completedDays array
  const completedDays = [];
  for (let i = 0; i < challenge.durationDays; i++) {
    completedDays.push({
      date: new Date(Date.now() + i * 24 * 60 * 60 * 1000),
      isCompleted: false,
      repsCompleted: 0
    });
  }
  
  const userChallenge = new UserChallenge({
    userId,
    challengeId,
    completedDays,
    startDate: new Date()
  });
  
  return await userChallenge.save();
};

// Update challenge progress when user completes exercise
exports.updateChallengeProgress = async (userId, challengeId, repsCompleted) => {
  const userChallenge = await UserChallenge.findOne({ userId, challengeId });
  if (!userChallenge) {
    throw new Error('User challenge not found');
  }
  
  if (userChallenge.isCompleted) {
    throw new Error('Challenge already completed');
  }
  
  const challenge = await Challenge.findById(challengeId);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Find today's entry in completedDays
  const dayIndex = userChallenge.completedDays.findIndex(day => {
    const dayDate = new Date(day.date);
    dayDate.setHours(0, 0, 0, 0);
    return dayDate.getTime() === today.getTime();
  });
  
  if (dayIndex === -1) {
    throw new Error('No challenge scheduled for today');
  }
  
  // Check if reps meet the target
  const isCompleted = repsCompleted >= challenge.targetReps;
  
  // Update the day's progress
  userChallenge.completedDays[dayIndex].isCompleted = isCompleted;
  userChallenge.completedDays[dayIndex].repsCompleted = repsCompleted;
  
  // Calculate streaks
  let currentStreak = 0;
  let longestStreak = userChallenge.longestStreak;
  
  // Check all days up to today
  const todayIndex = dayIndex;
  for (let i = 0; i <= todayIndex; i++) {
    if (userChallenge.completedDays[i].isCompleted) {
      currentStreak++;
      if (currentStreak > longestStreak) {
        longestStreak = currentStreak;
      }
    } else {
      currentStreak = 0;
    }
  }
  
  userChallenge.currentStreak = currentStreak;
  userChallenge.longestStreak = longestStreak;
  
  // Check if challenge is fully completed
  const allCompleted = userChallenge.completedDays.every(day => day.isCompleted);
  userChallenge.isCompleted = allCompleted;
  userChallenge.lastUpdated = new Date();
  
  await userChallenge.save();
  
  // Calculate points to award
  let pointsAwarded = 0;
  if (isCompleted) {
    pointsAwarded += challenge.dailyPoints;
  }
  if (allCompleted) {
    pointsAwarded += challenge.completionPoints;
  }
  
  return { 
    userChallenge, 
    pointsAwarded,
    isDailyComplete: isCompleted,
    isChallengeComplete: allCompleted
  };
};

// Get user's active challenges
exports.getUserChallenges = async (userId) => {
  return await UserChallenge.find({ userId, isCompleted: false })
    .populate('challengeId');
};

// Get user's completed challenges
exports.getUserCompletedChallenges = async (userId) => {
  return await UserChallenge.find({ userId, isCompleted: true })
    .populate('challengeId');
};