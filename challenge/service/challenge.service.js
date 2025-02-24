import Challenge from "../model/challenge.model.js";
import appError from "../../utils/appError.js";
import User from '../../user/model/user.model.js'
//  Create a new challenge
export const createChallenge = async (data) => {
 
  const newChallenge = await Challenge.create(data);
  if (!newChallenge) throw new appError("Can't create new challenge");
  
  return newChallenge;
};

//  Get all challenges
export const getAllChallenges = async () => {
  const challengeList = await Challenge.find().populate("exercise");
  if (!challengeList) throw new appError("Can't get challenges");
  
  return challengeList;
};

//  Get a challenge by ID
export const getChallengeById = async (challengeId) => {
  const challenge = await Challenge.findById(challengeId).populate("exercise");
  if (!challenge) throw new appError("Challenge not found");
  
  return challenge;
};

//  Update a challenge
export const updateChallenge = async (id, data) => {
  const updatedChallenge = await Challenge.findByIdAndUpdate(id, data, { 
    new: true, 
    runValidators: true 
  }).populate("exercise");

  if (!updatedChallenge) throw new appError("Can't update challenge");
  
  return updatedChallenge;
};

//  Delete a challenge
export const deleteChallenge = async (challengeId) => {
  const challenge = await Challenge.findById(challengeId);

  if (!challenge) throw new appError("Challenge not found");

  await challenge.deleteOne(); 
  return { message: "Challenge deleted successfully" };
};


