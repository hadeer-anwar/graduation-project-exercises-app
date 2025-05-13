import express from 'express'
import { authToken } from '../middlewares/authToken';
import {joinSession, createSession} from '../challenge/controller/session.controller'
const sessionRouter = express.Router();

sessionRouter.post('/',authToken,createSession)
sessionRouter.post('/:sessionId',authToken,joinSession)
