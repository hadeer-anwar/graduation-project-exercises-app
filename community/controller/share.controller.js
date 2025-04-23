import asyncWrapper from '../../middlewares/asyncWrapper.js';
import * as shareService from '../service/share.service.js';


export const sharePost = asyncWrapper(async (req, res) => {
  const post = await shareService.sharePost(req.params.id);
  res.status(200).json({
    success: true,
    data: post
  });
});