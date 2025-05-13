import Session from '../model/Session.model'
import Challenge from "../models/Challenge";
import appError from "../../utils/appError";

// Generate random session ID (e.g., "ABCD1234")
const generateRandomId = () => Math.random().toString(36).slice(2, 10).toUpperCase();

// Host creates a session
import PartySession from "../models/partySession.model.js";
import Challenge from "../models/challenge.model.js";
import appError from "../utils/appError.js";

export const createPartySession = async (hostId, challengeCount = 15) => {
  // Step 1: Get random mix of exercise and trivia challenges
  const exerciseChallenges = await Challenge.aggregate([
    { $match: { type: "exercise", isActive: true } },
    { $sample: { size: Math.floor(challengeCount * 0.7) } } // 70% exercises
  ]);

  const triviaChallenges = await Challenge.aggregate([
    { $match: { type: "trivia", isActive: true } },
    { $sample: { size: Math.ceil(challengeCount * 0.3) } } // 30% trivia
  ]);

  // Step 2: Combine and shuffle challenges
  const allChallenges = [...exerciseChallenges, ...triviaChallenges]
    .sort(() => Math.random() - 0.5) // Shuffle
    .slice(0, challengeCount); // Ensure exact count

  // Step 3: Create session
  const session = await PartySession.create({
    host: hostId,
    challenges: allChallenges.map(c => c._id),
    sessionId: generateRandomId() // Your existing ID generator
  });

  return session;
};

// User joins a session
export const joinSession = async (sessionId, userId) => {
  const session = await Session.findOne({ sessionId });
  if (!session) throw appError("Session not found", 404);
  if (session.status !== "waiting") throw appError("Session already started", 400);

  session.participants.push(userId);
  await session.save();
  return session;
};

