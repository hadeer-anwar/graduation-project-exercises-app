import express from "express";
import { getLeaderboard, updateProgress , getLastLeaderboard, getUserChallengeProgressController} from "../challenge/controller/userChallengeProgress.controller.js";


const userChallengeProgressRouter = express.Router();
userChallengeProgressRouter.post('/update', updateProgress)
userChallengeProgressRouter.get('/leaderboard/last-session', getLastLeaderboard);
userChallengeProgressRouter.get('/leaderboard/:sessionId', getLeaderboard)
userChallengeProgressRouter.get('/user-sessions/:id', getUserChallengeProgressController)
export default userChallengeProgressRouter;