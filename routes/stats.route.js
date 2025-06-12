import express from 'express';
import { getCommunityStats, getStats, getUserAgeChart } from '../stats/stats.controller.js';

const statsRouter = express.Router();

statsRouter.get('/', getStats);
statsRouter.get('/ages', getUserAgeChart);
statsRouter.get('/community', getCommunityStats);


export default statsRouter;
