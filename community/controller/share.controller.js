import asyncWrapper from '../../middlewares/asyncWrapper.js';
import * as shareService from '../service/share.service.js';

export const sharePost = asyncWrapper(async (req, res) => {
  const post = await shareService.sharePost(req.params.postId, req.user._id);
  res.status(200).json({
    success: true,
    message: "post shared successfully",
    data: post
  });
});

export const undoSharePost = asyncWrapper(async (req, res) => {
  const post = await shareService.undoSharePost(req.params.postId, req.user._id);
  res.status(200).json({
    success: true,
    message: "post unshared successfully",
  });
});