import express from 'express';
import {
  createPost,
  getPosts,
  getPost,
  deletePost,
  getPostDetails,
  getUserPosts,
  getUserSharedPosts,
  getAllUserPosts,
  editPost,
  getFollowingPosts
} from '../community/controller/post.controller.js';
import { uploadFiles } from "../cloudinary/cloudinaryConfig.js";
import { postValidator } from '../middlewares/postValidator.js';
import { commentValidator } from '../middlewares/commentValidator.js';
import {likePost, unlikePost} from '../community/controller/like.controller.js';
import {sharePost, undoSharePost} from '../community/controller/share.controller.js'
import { addComment, deleteComment, editComment, getPostComments, replyToComment } from '../community/controller/comment.controller.js';
import { authToken } from "../middlewares/authToken.js";


const communityRouter = express.Router();

communityRouter.get("/posts/getPosts",getPosts);
communityRouter.post("/posts/createPost",authToken,
  uploadFiles.fields([
    { name: "imageUrls", maxCount: 4 },
    { name: "videoUrls", maxCount: 4 },
  ])
  ,postValidator, createPost);
communityRouter.get('/posts/getPostById/:id',getPost)
communityRouter.get('/posts/getComments/:id',getPostComments)
communityRouter.get('/posts/details/:id', getPostDetails)
communityRouter.delete( '/posts/deletePostById/:id',authToken, deletePost);
communityRouter.put(
  "/posts/edit/:id",
  authToken,
  uploadFiles.fields([
    { name: "imageUrls", maxCount: 4 },
    { name: "videoUrls", maxCount: 4 },
  ]),
  postValidator,
  editPost
);

communityRouter.post('/like/:postId', authToken, likePost);
communityRouter.post('/unlike/:postId', authToken, unlikePost);

communityRouter.post('/share/:postId', authToken, sharePost);
communityRouter.delete('/undoshare/:postId', authToken, undoSharePost);

communityRouter.post('/comments/addComment/:postId', authToken,commentValidator ,addComment);
communityRouter.post('/comments/replyToComment/:commentId', authToken, replyToComment);

communityRouter.patch('/comments/editComment/:commentId', authToken,commentValidator ,editComment);
communityRouter.delete('/comments/deleteComment/:commentId', authToken, deleteComment);

communityRouter.get('/following/posts', authToken, getFollowingPosts)

communityRouter.get('/user-posts/:id', getUserPosts);
communityRouter.get('/user-shares', authToken, getUserSharedPosts);
communityRouter.get('/user-all-posts', authToken, getAllUserPosts);
export default communityRouter;
