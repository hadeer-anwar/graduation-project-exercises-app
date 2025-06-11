import express from 'express';
import { getStats, getUserAgeChart } from '../stats/stats.controller.js';

const statsRouter = express.Router();

statsRouter.get('/', getStats);
statsRouter.get('/ages', getUserAgeChart);

export default statsRouter;
