// services/userChallengeProgressService.js
import UserChallengeProgress from '../model/userChallengeProgress.model.js';
import Session from '../model/Session.model.js'
import appError from '../../utils/appError.js'
import User from '../../user/model/user.model.js';


export const updateChallengeProgress = async ({ userId, sessionId, challengeId, score, completed }) => {
  // 1. Validate user is part of session (participant or host)
  const session = await Session.findOne({sessionId});
  if (!session) throw new appError('Session not found');
  if(session.status !== "active") throw new appError("session not active")

  const isParticipant = session.participants?.some(p => p.toString() === userId.toString());
  const isHost = session.host?.toString() === userId.toString();

  if (!isParticipant && !isHost) {
    throw new appError('User is not a participant or host of this session',404);
  }

  // 2. Find or create user challenge progress
  let userProgress = await UserChallengeProgress.findOne({ userId, sessionId });

  if (!userProgress) {
    userProgress = new UserChallengeProgress({
      userId,
      sessionId,
      challenges: []
    });
  }

  // 3. Find or append challenge progress
  let challengeEntry = userProgress.challenges.find(c => c.challengeId.toString() === challengeId.toString());

  if (!challengeEntry) {
    userProgress.challenges.push({
      challengeId,
      completed,
      score
    });
  } else {
    challengeEntry.completed = completed;
    challengeEntry.score = score;
  }

  // 4. Recalculate total score
  userProgress.totalScore = userProgress.challenges.reduce((sum, ch) => sum + (ch.score || 0), 0);

  // 5. update points
   const user = await User.findById(userId);
  if (!user) throw new appError('User not found', 404);

  
  user.points = (user.points || 0) + score;

  await userProgress.save();
  return userProgress;
};


export const getLeaderboardForSession = async (sessionId) => {
  const leaderboard = await UserChallengeProgress.find({ sessionId })
    .populate('userId', 'name profilePic') // Adjust fields as needed
    .sort({ totalScore: -1 });

  return leaderboard;
};


export const getLastSessionLeaderboard = async () => {
  // Find all sessions ordered by newest
  const sessions = await Session.find().sort({ createdAt: -1 });

  for (const session of sessions) {
    const leaderboard = await getLeaderboardForSession(session.sessionId);
    
    // If the session has a valid leaderboard (not empty), return it
    if (leaderboard && leaderboard.length > 0) {
      return leaderboard;
    }
  }

  // If no session has a leaderboard
  return [];
};