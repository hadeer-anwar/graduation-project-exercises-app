import asyncWrapper from "../../middlewares/asyncWrapper.js";
import * as SessionService from "../service/session.service.js";

export const createSession = asyncWrapper(async (req, res) => {
  const session = await SessionService.createSession(req.user._id, req.body.challengeCount);
  res.status(201).json({
    success: true,
    data: session
  });
});

export const joinSession = asyncWrapper(async (req, res) => {
  const session = await SessionService.joinSession(req.params.sessionId, req.user._id);
   res.status(200).json({
    success: true,
    message: "session joined successfully",
    session
  });
});

export const startSession = asyncWrapper (async (req,res) => {
  const session = await SessionService.startSession(req.params.sessionId, req.user._id);
  res.status(200).json({
    success: true,
    message: "session started",
    session
  });
})

export const endSession = asyncWrapper (async (req,res) => {
  const session = await SessionService.endSession(req.params.sessionId, req.user._id);
  res.status(200).json({
    success: true,
    message: "session completed",
    session
  });
})


export const getAllSessions = asyncWrapper( async (req, res) =>{
   const sessions = await SessionService.getAllSessions();
     res.status(200).json({success: true, data: sessions });
})
