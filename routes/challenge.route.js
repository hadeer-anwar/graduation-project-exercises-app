import express from 'express'
import { 
     createChallenge,
     deleteChallenge, 
     getAllChallenges, 
     getChallenge, 
     updateChallenge } from "../challenge/controller/challenge.controller.js";


import { validateChallenge } from '../validators/challenge.validation.js';

const challengeRouter = express.Router();

challengeRouter.post('/create', createChallenge)
challengeRouter.get('/', getAllChallenges)
challengeRouter.get('/:id', getChallenge)
challengeRouter.put('/:id', updateChallenge)
challengeRouter.delete('/:id', deleteChallenge)


export default challengeRouter
