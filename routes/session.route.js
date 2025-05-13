import express from 'express'
import { authToken } from "../middlewares/authToken.js";
import {joinSession, createSession} from '../challenge/controller/session.controller.js'
const sessionRouter = express.Router();

sessionRouter.post('/createSession', authToken, createSession)
sessionRouter.post('/:sessionId', authToken, joinSession)

export default sessionRouter;
