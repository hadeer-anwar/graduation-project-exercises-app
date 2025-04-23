import asyncWrapper from '../../middlewares/asyncWrapper.js';
import * as commentService from '../service/comment.service.js';

export const addComment = asyncWrapper(async (req, res) => {
  if (!req.user || !req.user._id) {
    return res.status(401).json({ status: false, message: "Unauthorized" });
  }
  
  const { content } = req.body;
  const { post, comment } = await commentService.addComment(
    req.params.id,
    req.user._id,
    content
  );
  
  res.status(201).json({
    success: true,
    data: { post, comment }
  });
});

export const replyToComment = asyncWrapper(async (req, res) => {
  if (!req.user || !req.user._id) {
    return res.status(401).json({ status: false, message: "Unauthorized" });
  }
  
  const { content } = req.body;
  const reply = await commentService.replyToComment(
    req.params.commentId,
    req.user._id,
    content
  );
  
  res.status(201).json({
    success: true,
    data: reply
  });
});
