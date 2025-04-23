import asyncWrapper from '../../middlewares/asyncWrapper.js';
import * as likeService from '../service/like.service.js';

export const likePost = asyncWrapper(async (req, res) => {
  if (!req.user || !req.user._id) {
    return res.status(401).json({ status: false, message: "Unauthorized" });
  }
  
  const post = await likeService.likePost(req.params.id, req.user._id);
  res.status(200).json({
    success: true,
    data: post
  });
});