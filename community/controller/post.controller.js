import asyncWrapper from '../../middlewares/asyncWrapper.js';
import * as postService from '../service/post.service.js';

export const createPost = asyncWrapper(async (req, res) => {
    const { content } = req.body;
    console.log("req",req.files)
    const userId = req.user._id.toString();
    
    // Process uploaded files
    const imageUrls = req.files['imageUrls']?.map(file => file.path) || [];
    const videoUrls = req.files['videoUrls']?.map(file => file.path) || [];
    
    // Combine with any URLs provided in the request
    const combinedImageUrls = [...imageUrls, ...(req.body.imageUrls || [])];
    const combinedVideoUrls = [...videoUrls, ...(req.body.videoUrls || [])];

    const post = await postService.createPost(userId, { 
        content, 
        imageUrls: combinedImageUrls,
        videoUrls: combinedVideoUrls
    });
    console.log("poost",post)

    res.status(201).json({
        success: true,
        message: "post created successfully",
        data: post
    });
});

export const getPosts = asyncWrapper(async (req, res) => {
    const posts = await postService.getAllPosts();
    res.status(200).json({
        success: true,
        message: "all posts",
        data: posts
    });
});

export const getPost = asyncWrapper(async (req, res) => {
    const post = await postService.getPostById(req.params.id);
    if (!post) return res.status(404).json({ 
        success: false,
        message: 'Post not found' 
    });
    res.status(200).json({
        success: true,
        message: "post by id",
        data: post
    });
});

export const deletePost = asyncWrapper(async (req, res) => {
    if (!req.user || !req.user._id) {
        return res.status(401).json({ 
            success: false, 
            message: "Unauthorized" 
        });
    }

    const userId = req.user._id.toString();
    const postId = req.params.id;

    await postService.deletePost(postId, userId);
    res.status(200).json({ 
        success: true,
        message: 'Post deleted successfully' 
    });
});

export const getPostDetails = asyncWrapper(async (req, res) => {
    const post = await postService.getPostWithComments(req.params.id);
    
    res.status(200).json({
        success: true,
        message: "post details",
        data: post
    });
});

// Get authenticated user's own created posts
export const getUserPosts = asyncWrapper(async (req, res) => {
    const posts = await postService.getUserCreatedPosts(req.user._id);
    res.status(200).json({
        success: true,
        message: "user posts",
        data: posts
    });
});

// Get authenticated user's own shared posts
export const getUserSharedPosts = asyncWrapper(async (req, res) => {
    const sharedPosts = await postService.getUserSharedPosts(req.user._id);
    res.status(200).json({
        success: true,
        message: "posts shared by user",
        data: sharedPosts
    });
});



// Get combined posts (created + shared) for a user
export const getAllUserPosts = asyncWrapper(async (req, res) => {
    const userId = req.params.userId || req.user._id;
    const posts = await postService.getAllUserPosts(userId);
    res.status(200).json({
        success: true,
        message: "all posts",
        data: posts
    });
});


export const editPost = asyncWrapper(async (req, res) => {
    const postId = req.params.id;
    const userId = req.user._id.toString();

    // Combine file uploads and body URLs (if any)
    const imageUrls = req.files?.imageUrls?.map(file => file.path) || [];
    const videoUrls = req.files?.videoUrls?.map(file => file.path) || [];

    const combinedImageUrls = [...imageUrls, ...(req.body.imageUrls || [])];
    const combinedVideoUrls = [...videoUrls, ...(req.body.videoUrls || [])];

    const updatedPost = await postService.updatePost(postId, userId, {
        content: req.body.content,
        imageUrls: combinedImageUrls,
        videoUrls: combinedVideoUrls,
    });

    res.status(200).json({
        success: true,
        message: "Post updated successfully",
        data: updatedPost,
    });
});

export const getPostWithComments = asyncWrapper(async (req, res) => {
    const postId = req.params.id;

    const post = await postService.getPostWithComments(postId);

    if (!post) {
        return res.status(404).json({
            success: false,
            message: "Post not found",
        });
    }

    res.status(200).json({
        success: true,
        message: "Post with comments and replies",
        data: post,
    });
});



export const getFollowingPosts = asyncWrapper(async (req, res) => {
  const userId = req.user._id;

  const posts = await postService.getPostsFromFollowing(userId);

  res.status(200).json({
    success: true,
    message: "Posts from followed users",
    data: posts
  });
});

