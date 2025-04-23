import asyncWrapper from '../../middlewares/asyncWrapper.js';
import * as commentService from '../service/comment.service.js';

export const addComment = asyncWrapper(async (req, res) => {
  if (!req.user || !req.user._id) {
    return res.status(401).json({ status: false, message: "Unauthorized" });
  }
  
  const { content } = req.body;
  const { post, comment } = await commentService.addComment(
    req.params.postId, // post ID from URL params
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
  console.log("boodu",req.user," ",req.body)
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

export const editComment = asyncWrapper(async (req, res) => {
  if (!req.user || !req.user._id) {
    return res.status(401).json({ status: false, message: "Unauthorized" });
  }

  const { content } = req.body;
  const comment = await commentService.editComment(
    req.params.commentId,
    req.user._id,
    content
  );

  res.status(200).json({
    success: true,
    data: comment
  });
});

export const deleteComment = asyncWrapper(async (req, res) => {
  if (!req.user || !req.user._id) {
    return res.status(401).json({ status: false, message: "Unauthorized" });
  }

  await commentService.deleteComment(
    req.params.commentId,
    req.user._id
  );

  res.status(200).json({
    success: true,
    message: "Comment deleted successfully"
  });
});