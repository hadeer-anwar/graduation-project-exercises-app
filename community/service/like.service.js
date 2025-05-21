import appError from "../../utils/appError.js";
import Post from "../model/post.model.js";
import { sendNotification } from "../../utils/sendNotification.js";


export const likePost = async (postId, userId) => {
  const post = await Post.findById(postId);
  if (!post) throw new appError('Post not found');

  const alreadyLiked = post.likes.some(like => like.toString() === userId.toString());

  if (alreadyLiked) {
    post.likes = post.likes.filter(like => like.toString() !== userId.toString());
  } else {
    post.likes.push(userId);
  }

  try {
    await post.save();
    console.log("Updated likes:", post.likes);
  } catch (err) {
    console.error("Failed to save post:", err);
  }

  return await Post.findById(post._id).populate('likes', 'name profilePicture');
};



// Dedicated unlike function for more explicit control
export const unlikePost = async (postId, userId) => {
  const post = await Post.findById(postId);
  if (!post) throw new appError('Post not found', 404);

  const hasLiked = post.likes.some(like => like.toString() === userId.toString());
  if (!hasLiked) {
    throw new appError('You have not liked this post', 400);
  }

  post.likes = post.likes.filter(like => like.toString() !== userId.toString());
  await post.save();

  const populatedPost = await Post.findById(post._id)
    .populate('user', 'name profilePicture')
    .populate({
      path: 'comments',
      populate: [
        {
          path: 'user',
          select: 'name profilePicture'
        },
        {
          path: 'replies',
          populate: [
            {
              path: 'user',
              select: 'name profilePicture'
            },
            {
              path: 'replies',
              populate: {
                path: 'user',
                select: 'name profilePicture'
              }
            }
          ]
        }
      ]
    })
    .populate('likes', 'name profilePicture');

  return populatedPost;
};
