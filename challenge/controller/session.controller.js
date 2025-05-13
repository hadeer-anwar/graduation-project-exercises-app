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
  res.status(200).json(session);
});
