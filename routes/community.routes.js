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
import {likePost} from '../community/controller/like.controller.js';
import {sharePost} from '../community/controller/share.controller.js'
import { addComment, replyToComment } from '../community/controller/comment.controller.js';
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

communityRouter.post('/like/:id', authToken, likePost);
communityRouter.post('/share/:id', authToken, sharePost);

communityRouter.post('/addComment/:id', authToken, addComment);
communityRouter.post('/comments/reply/:commentId', authToken, replyToComment);
communityRouter.get('/details/:id', getPostDetails);


export default communityRouter;
