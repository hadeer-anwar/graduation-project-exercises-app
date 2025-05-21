import Session from '../model/Session.model.js';
import Challenge from '../model/challenge.model.js';
import appError from "../../utils/appError.js";

// Generate random session ID (e.g., "ABCD1234")
const generateRandomId = () => Math.random().toString(36).slice(2, 10).toUpperCase();

// Host creates a session

export const createSession = async (hostId, challengeCount = 2) => {
  // Step 1: Get random mix of exercise and trivia challenges
  const exerciseChallenges = await Challenge.aggregate([
    { $match: { type: "exercise" } },
    { $sample: { size: Math.floor(challengeCount * 0.5) } } 
  ]);

  const triviaChallenges = await Challenge.aggregate([
    { $match: { type: "trivia" } },
    { $sample: { size: Math.ceil(challengeCount * 0.5) } } 
  ]);

  // Step 2: Combine and shuffle challenges
  const allChallenges = [...exerciseChallenges, ...triviaChallenges]
    .sort(() => Math.random() - 0.5) // Shuffle
    .slice(0, challengeCount); // Ensure exact count

  // Step 3: Create session
  const session = await Session.create({
    host: hostId,
    challenges: allChallenges.map(c => c._id),
    sessionId: generateRandomId() // Your existing ID generator
  });

    const populatedSession = await Session.findById(session._id)
    .populate({
      path: 'challenges',
      populate: [
        { path: 'exerciseId' },
        { path: 'questionId', select: 'question options' }
      ]
    })
    .populate('host', 'name email profilePicture');

  return populatedSession;
};

export const startSession = async (sessionId, userId) => {
  const session = await Session.findOne({sessionId});
  if (!session) {
    throw new appError("Session not found", 404);
  }
// console.log("host", session.host)
// console.log("user", userId)
 if (session.host.toString() !== userId.toString()) {
  throw new appError("Only the host can start the session", 403);
}

  if (session.status === 'active') {
    throw new appError("Session is already active", 400);
  }

  session.status = "active";
  await session.save();

    const populatedSession = await Session.findById(session._id)
    .populate({
      path: 'challenges',
      populate: [
        { path: 'exerciseId' },
        { path: 'questionId', select: 'question options' }
      ]
    })
    .populate('host', 'name email profilePicture')
    .populate('participants', 'name profilePicture');  

  return populatedSession;


};

export const endSession = async (sessionId,userId ) => {
    const session = await Session.findOne({sessionId});
  if (!session) {
    throw new appError("Session not found", 404);
  }
 if (session.host.toString() !== userId.toString()) {
  throw new appError("Only the host can start the session", 403);
}

  if (session.status === 'completed') {
    throw new appError("Session is already ended", 400);
  }

  session.status = "completed";
  await session.save();

  return session;
}

// User joins a session
export const joinSession = async (sessionId, userId) => {
  const session = await Session.findOne({ sessionId });
  if (!session) throw new appError("Session not found", 404);
  if (session.status === "completed") throw new appError("Session ended", 400);

  // Check if user already joined
  const alreadyJoined = session.participants.includes(userId);
  if (alreadyJoined) throw new appError("User already joined", 400);

  session.participants.push(userId);
  await session.save();

  const populatedSession = await Session.findById(session._id)
    .populate({
      path: 'challenges',
      populate: [
        { path: 'exerciseId' },
        { path: 'questionId', select: 'question options' }
      ]
    })
    .populate('host', 'name email profilePicture')
    .populate('participants', 'name profilePicture');  

  return populatedSession;
};


export const getAllSessions = async () => {
  const sessions = await Session.find()
    .populate({
      path: 'challenges',
      populate: [
        { path: 'exerciseId' },
        { path: 'questionId', select: 'question options' }
      ]
    })
    .populate('host', 'name profilePicture')           
    .populate('participants', 'name profilePicture');  
  return sessions;
};

