import Challenge from "../model/challenge.model.js";
import appError from "../../utils/appError.js";
import User from '../../user/model/user.model.js'
// ✅ Create a new challenge
export const createChallenge = async (data) => {
 
  const newChallenge = await Challenge.create(data);
  if (!newChallenge) throw new appError("Can't create new challenge");
  
  return newChallenge;
};

// ✅ Get all challenges
export const getAllChallenges = async () => {
  const challengeList = await Challenge.find().populate("exercises.exercise");
  if (!challengeList) throw new appError("Can't get challenges");
  
  return challengeList;
};

// ✅ Get a challenge by ID
export const getChallengeById = async (challengeId) => {
  const challenge = await Challenge.findById(challengeId).populate("exercises.exercise");
  if (!challenge) throw new appError("Challenge not found");
  
  return challenge;
};

// ✅ Update a challenge
export const updateChallenge = async (id, data) => {
  const updatedChallenge = await Challenge.findByIdAndUpdate(id, data, { 
    new: true, 
    runValidators: true 
  }).populate("exercises.exercise");

  if (!updatedChallenge) throw new appError("Can't update challenge");
  
  return updatedChallenge;
};

// ✅ Delete a challenge
export const deleteChallenge = async (challengeId) => {
  const challenge = await Challenge.findById(challengeId);

  if (!challenge) throw new appError("Challenge not found", 404);

  await challenge.deleteOne(); // Ensures pre middleware runs if needed
  return { message: "Challenge deleted successfully" };
};

/**
 * Updates user challenge progress when they complete a day's challenge.
 */ 

export const updateChallengeProgress = async (userId, challengeId, completedReps) => {
  const user = await User.findById(userId);
  if (!user) throw new appError("User not found", 404);

  const challenge = await Challenge.findById(challengeId);
  if (!challenge) throw new appError("Challenge not found", 404);

  // Find challenge in user's workingChallenges
  const userChallenge = user.workingChallenges.find(
    (c) => c.challenge.toString() === challengeId
  );

  if (!userChallenge) throw new appError("Challenge not found in user data", 400);

  const today = new Date().setHours(0, 0, 0, 0);
  const lastUpdated = userChallenge.lastUpdated
    ? new Date(userChallenge.lastUpdated).setHours(0, 0, 0, 0)
    : null;

  //  Check if the user met the daily target
  if (completedReps < challenge.dailyTarget) {
    throw new appError(`You need to complete at least ${challenge.dailyTarget} reps!`, 400);
  }

  //   If today is a new day, update progress
  if (!lastUpdated || lastUpdated < today) {
    userChallenge.completedDays += 1;
    user.points += challenge.pointsPerDay; // Add daily points

    if (lastUpdated && lastUpdated === today - 86400000) {
      userChallenge.streakDays += 1; // Increase streak
    } else {
      userChallenge.streakDays = 1; // Reset streak if a day was missed
    }

    userChallenge.lastUpdated = new Date(); // Update lastUpdated

    // ✅ Move to achievements if challenge is completed
    if (userChallenge.completedDays >= challenge.requiredDays) {
      user.achievements.push(challengeId);

      // Remove from workingChallenges
      user.workingChallenges = user.workingChallenges.filter(
        (c) => c.challenge.toString() !== challengeId
      );

      // Add total challenge completion points
      user.points += challenge.totalPoints;
    }
  }

  await user.save();
  return userChallenge;
};
