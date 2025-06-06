// controllers/userChallengeProgressController.js
import * as progressService from '../service/userChallengeProgress.service.js';
import asyncWrapper from '../../middlewares/asyncWrapper.js'

import { io } from '../../index.js'

export const updateProgress = asyncWrapper(async (req, res) => {
  const { userId, sessionId, challengeId, score, completed } = req.body;

  const updatedProgress = await progressService.updateChallengeProgress({
    userId, sessionId, challengeId, score, completed
  });

  // Fetch the new leaderboard
  const updatedLeaderboard = await progressService.getLeaderboardForSession(sessionId);

  // Emit leaderboard to clients in the session
  io.to(sessionId).emit('leaderboardUpdated', updatedLeaderboard);

  res.status(200).json({ success: true, data: updatedProgress });
});


export const getLeaderboard = asyncWrapper(async (req, res) => {

    const { sessionId } = req.params;
    const leaderboard = await progressService.getLeaderboardForSession(sessionId);

    res.status(200).json({ success: true, data: leaderboard });

});
