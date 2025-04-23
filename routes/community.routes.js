import express from 'express';
import {
  createPost,
  getPosts,
  getPost,
  deletePost,
  getPostDetails
} from '../community/controller/post.controller.js';
import { uploadFiles } from "../cloudinary/cloudinaryConfig.js";
import { postValidator } from '../middlewares/postValidator.js';
import { commentValidator } from '../middlewares/commentValidator.js';
import {likePost} from '../community/controller/like.controller.js';
import {sharePost} from '../community/controller/share.controller.js'
import { addComment, deleteComment, editComment, replyToComment } from '../community/controller/comment.controller.js';
import { authToken } from "../middlewares/authToken.js";


const communityRouter = express.Router();

communityRouter.get("/getPost",getPosts);
communityRouter.post("/createPost",authToken,
  uploadFiles.fields([
    { name: "image", maxCount: 4 },
    { name: "video", maxCount: 4 },
  ])
  ,postValidator, createPost);
communityRouter.get('/getPostById/:id',getPost)
  
communityRouter.delete( '/deletePostById/:id',authToken, deletePost);

communityRouter.post('/like/:postId', authToken, likePost);
communityRouter.post('/share/:postId', authToken, sharePost);

communityRouter.post('/comments/addComment/:postId', authToken,commentValidator ,addComment);
communityRouter.post('/comments/replyToComment/:commentId', authToken, replyToComment);
communityRouter.patch('/comments/:commentId', authToken,commentValidator ,editComment);
communityRouter.delete('/comments/:commentId', authToken, deleteComment);
communityRouter.get('/details/:postId', getPostDetails);


export default communityRouter;
