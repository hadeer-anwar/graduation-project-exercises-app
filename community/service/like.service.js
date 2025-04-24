import appError from "../../utils/appError.js";
import Post from "../model/post.model.js";

export const likePost = async (postId, userId) => {
  const post = await Post.findById(postId);
  if (!post) throw new appError('Post not found', 404);
  
  // Check if user already liked the post
  const alreadyLiked = post.likes.some(like => like.toString() === userId.toString());
  
  if (alreadyLiked) {
    // Unlike the post
    post.likes = post.likes.filter(like => like.toString() !== userId.toString());
  } else {
    // Like the post
    post.likes.push(userId);
  }
  
  await post.save();
  return post;
};

// Dedicated unlike function for more explicit control
export const unlikePost = async (postId, userId) => {
  const post = await Post.findById(postId);
  if (!post) throw new appError('Post not found', 404);

  // Check if user actually liked the post
  const hasLiked = post.likes.some(like => like.toString() === userId.toString());
  
  if (!hasLiked) {
    throw new appError('You have not liked this post', 400);
  }

  // Remove the like
  post.likes = post.likes.filter(like => like.toString() !== userId.toString());
  await post.save();
  
  return post;
};