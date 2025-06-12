import { getStats as getStatsService, getUserAgeStats, getCommunityStats as communityStats } from './stats.service.js';
import asyncWrapper from '../middlewares/asyncWrapper.js';

export const getStats = asyncWrapper(async (req, res) => {
  const stats = await getStatsService();
  res.status(200).json(stats);
});

export const getUserAgeChart = asyncWrapper(async (req, res) => {
  const data = await getUserAgeStats();
  res.status(200).json(data);
});


export const getCommunityStats = asyncWrapper (async (req, res) => {
  
    const stats = await communityStats();
    
    res.status(200).json(stats);

});