import express from 'express';
import {
  createPost,
  getPosts,
  getPost,
  deletePost
} from '../community/controller/post.controller.js';
import { uploadFiles } from "../cloudinary/cloudinaryConfig.js";
import { postValidator } from '../middlewares/postValidator.js';

const postRouter = express.Router();

postRouter.get("/getPost",getPosts);
postRouter.post("/createPost",
  uploadFiles.fields([
    { name: "image", maxCount: 4 },
    { name: "video", maxCount: 4 },
  ])
  ,postValidator, createPost);

postRouter.get('/getPostById/:id',getPost)
  
postRouter.delete( '/deletePostById/:id', deletePost);

export default postRouter;
