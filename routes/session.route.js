import express from 'express'
import { authToken } from "../middlewares/authToken.js";
import {joinSession, createSession, endSession, getAllSessions, startSession} from '../challenge/controller/session.controller.js'
const sessionRouter = express.Router();

sessionRouter.post('/createSession', authToken, createSession)
sessionRouter.post('/join/:sessionId', authToken, joinSession)
sessionRouter.post('/start/:sessionId',authToken, startSession)
sessionRouter.post('/end/:sessionId',authToken, endSession)
sessionRouter.get('/', getAllSessions)

export default sessionRouter;
