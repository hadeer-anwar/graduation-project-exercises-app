import UserChallenge from '../model/userChallenge.model.js';
import Challenge from '../model/challenge.model.js';
import asyncWrapper from '../../middlewares/asyncWrapper.js';
const { addPoints } = require('./userController');


export const getUserChallenges = asyncWrapper( async (req, res) => {
  
    const userId = req.user._id;
    
    const userChallenges = await UserChallenge.find({ userId })
      .populate({
        path: 'challengeId',
        select: 'name description targetReps durationDays dailyPoints completionPoints'
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: userChallenges.length,
      data: userChallenges
    });
  
});


export const getUserChallenge = asyncWrapper( async (req, res) => {
  
    const userChallenge = await UserChallenge.findOne({
      _id: req.params.id,
      userId: req.user._id
    }).populate('challengeId');

    if (!userChallenge) {
      return res.status(404).json({
        success: false,
        error: 'No challenge found'
      });
    }

    res.status(200).json({
      success: true,
      data: userChallenge
    }); 
});


export const startChallenge = asyncWrapper( async (req, res) => {
  
    const { challengeId } = req.body;
    const userId = req.user._id;

    // Check if challenge exists
    const challenge = await Challenge.findById(challengeId);
    if (!challenge) {
      return res.status(404).json({
        success: false,
        error: 'Challenge not found'
      });
    }

    // Check if user already has this challenge
    const existingUserChallenge = await UserChallenge.findOne({
      userId,
      challengeId,
      isCompleted: false
    });

    if (existingUserChallenge) {
      return res.status(400).json({
        success: false,
        error: 'You already have this active challenge'
      });
    }

    // Initialize completedDays array
    const completedDays = Array(challenge.durationDays).fill().map((_, i) => ({
      date: new Date(Date.now() + i * 24 * 60 * 60 * 1000),
      isCompleted: false,
      repsCompleted: 0
    }));

    const userChallenge = await UserChallenge.create({
      userId,
      challengeId,
      completedDays,
      startDate: new Date()
    });

    res.status(201).json({
      success: true,
      data: userChallenge
    });
  
});


export const updateChallengeProgress = asyncWrapper( async (req, res) => {
  try {
    const { repsCompleted } = req.body;
    const userId = req.user._id;
    const userChallengeId = req.params.id;

    // Find user challenge
    const userChallenge = await UserChallenge.findOne({
      _id: userChallengeId,
      userId
    }).populate('challengeId');

    if (!userChallenge) {
      return res.status(404).json({
        success: false,
        error: 'Challenge not found'
      });
    }

    if (userChallenge.isCompleted) {
      return res.status(400).json({
        success: false,
        error: 'Challenge already completed'
      });
    }

    const challenge = userChallenge.challengeId;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Find today's entry in completedDays
    const dayIndex = userChallenge.completedDays.findIndex(day => {
      const dayDate = new Date(day.date);
      dayDate.setHours(0, 0, 0, 0);
      return dayDate.getTime() === today.getTime();
    });

    if (dayIndex === -1) {
      return res.status(400).json({
        success: false,
        error: 'No challenge scheduled for today'
      });
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
    for (let i = 0; i <= dayIndex; i++) {
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
      // Add daily points to user
      await addPoints(userId, challenge.dailyPoints);
    }
    if (allCompleted) {
      pointsAwarded += challenge.completionPoints;
      // Add completion points to user
      await addPoints(userId, challenge.completionPoints);
    }

    res.status(200).json({
      success: true,
      data: {
        userChallenge,
        pointsAwarded,
        isDailyComplete: isCompleted,
        isChallengeComplete: allCompleted
      }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
});


export const deleteUserChallenge = asyncWrapper( async (req, res) => {

    const userChallenge = await UserChallenge.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!userChallenge) {
      return res.status(404).json({
        success: false,
        error: 'No challenge found'
      });
    }

    await userChallenge.remove();

    res.status(200).json({
      success: true,
      data: {}
    });
   
});