import asyncWrapper from '../../middlewares/asyncWrapper.js';
import * as postService from '../service/post.service.js';

export const createPost = asyncWrapper(async (req, res) => {
    
   console.log(req.body,"watch")
    
    const { content } = req.body;
    const userId = req.body.user;
    
    console.log("again", userId)
    // Process uploaded files
    const imageUrls = req.files['imageUrls']?.map(file => `/uploads/posts/${file.filename}`) || [];
    const videoUrls = req.files['videoUrls']?.map(file => `/uploads/posts/${file.filename}`) || [];
    
    // Combine with any URLs provided in the request
    const combinedImageUrls = [...imageUrls, ...(req.body.imageUrls || [])];
    const combinedVideoUrls = [...videoUrls, ...(req.body.videoUrls || [])];

    const post = await postService.createPost(userId, { 
      content, 
      imageUrls: combinedImageUrls,
      videoUrls: combinedVideoUrls
    });

    res.status(201).json({
      success: true,
      data: post
    });
  
});

export const getPosts =  asyncWrapper(async (req, res) => {

    const posts = await postService.getAllPosts();
    res.status(200).json(posts);

});

export const getPost = asyncWrapper( async (req, res) => {
  
    const post = await postService.getPostById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.status(200).json(post);
  
});

export const deletePost = asyncWrapper(async (req, res) => {

  if (!req.user || !req.user._id) {
    return res.status(401).json({ status: false, message: "Unauthorized" });
  }

  const userId = req.user._id.toString();
  const postId = req.params.id;
  


  await postService.deletePost(postId, userId);
  res.status(200).json({ message: 'Post deleted successfully' });
});

export const getPostDetails = asyncWrapper(async (req, res) => {
  const post = await postService.getPostWithComments(req.params.id);
  if (!post) return res.status(404).json({ message: 'Post not found' });
  
  res.status(200).json({
    success: true,
    data: post
  });
});