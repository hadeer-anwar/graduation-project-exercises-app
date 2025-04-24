import express from 'express';
import {
  createPost,
  getPosts,
  getPost,
  deletePost,
  getPostDetails,
  getUserPosts,
  getUserSharedPosts,
  getAllUserPosts
} from '../community/controller/post.controller.js';
import { uploadFiles } from "../cloudinary/cloudinaryConfig.js";
import { postValidator } from '../middlewares/postValidator.js';
import { commentValidator } from '../middlewares/commentValidator.js';
import {likePost} from '../community/controller/like.controller.js';
import {sharePost} from '../community/controller/share.controller.js'
import { addComment, deleteComment, editComment, getPostComments, replyToComment } from '../community/controller/comment.controller.js';
import { authToken } from "../middlewares/authToken.js";


const communityRouter = express.Router();

communityRouter.get("/posts/getPosts",getPosts);
communityRouter.post("/posts/createPost",authToken,
  uploadFiles.fields([
    { name: "image", maxCount: 4 },
    { name: "video", maxCount: 4 },
  ])
  ,postValidator, createPost);
communityRouter.get('/posts/getPostById/:id',getPost)
  
communityRouter.delete( '/posts/deletePostById/:id',authToken, deletePost);

communityRouter.post('/like/:postId', authToken, likePost);
communityRouter.post('/share/:postId', authToken, sharePost);

communityRouter.post('/comments/addComment/:postId', authToken,commentValidator ,addComment);
communityRouter.post('/comments/replyToComment/:commentId', authToken, replyToComment);

communityRouter.patch('/comments/editComment/:commentId', authToken,commentValidator ,editComment);
communityRouter.delete('/comments/deleteComment/:commentId', authToken, deleteComment);

// Add these routes
communityRouter.get('/user-posts', authToken, getUserPosts);
communityRouter.get('/user-shares', authToken, getUserSharedPosts);
communityRouter.get('/user-all-posts', authToken, getAllUserPosts);
export default communityRouter;
