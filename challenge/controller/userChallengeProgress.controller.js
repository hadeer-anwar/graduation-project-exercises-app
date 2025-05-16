// controllers/userChallengeProgressController.js
import * as progressService from '../service/userChallengeProgress.service.js';
import asyncWrapper from '../../middlewares/asyncWrapper.js'

export const updateProgress = asyncWrapper( async (req, res) => {

    const { userId, sessionId, challengeId, score, completed } = req.body;
    const updatedProgress = await progressService.updateChallengeProgress({ userId, sessionId, challengeId, score, completed });

    // Optionally emit leaderboard update via socket.io or similar
    // io.to(sessionId).emit("leaderboardUpdated", updatedLeaderboard);

    res.status(200).json({ success: true, data: updatedProgress });

});

export const getLeaderboard = asyncWrapper(async (req, res) => {

    const { sessionId } = req.params;
    const leaderboard = await progressService.getLeaderboardForSession(sessionId);

    res.status(200).json({ success: true, data: leaderboard });

});
