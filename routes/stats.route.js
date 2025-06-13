import express from 'express';
import { getCommunityStats,
     getStats,
      getUserAgeChart,
       getGlobalExerciseTimeStats,
    userMonthlyGrowthController,
 } from '../stats/stats.controller.js';

const statsRouter = express.Router();

statsRouter.get('/', getStats);
statsRouter.get('/ages', getUserAgeChart);
statsRouter.get('/community', getCommunityStats);
statsRouter.get('/exercise-time', getGlobalExerciseTimeStats);
statsRouter.get('/user-growth', userMonthlyGrowthController);


export default statsRouter;
