import asyncWrapper from "../../middlewares/asyncWrapper";
import * as SessionService from "../service/Session.service";

export const createSession = asyncWrapper(async (req, res) => {
  const session = await SessionService.createSession(req.user._id);
  res.status(201).json({ sessionId: session.sessionId });
});

export const joinSession = asyncWrapper(async (req, res) => {
  const session = await SessionService.joinSession(req.params.sessionId, req.user._id);
  res.status(200).json(session);
});
