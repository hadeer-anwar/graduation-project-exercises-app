import appError from "../../utils/appError.js";
import Post from "../../community/model/post.model.js";
import User from "../../user/model/user.model.js";

export const sharePost = async (postId, userId) => {
  // Check if user already shared this post
  const alreadyShared = await Post.findOne({
    _id: postId,
    sharedBy: userId
  });

  if (alreadyShared) {
    throw new appError('You have already shared this post', 400);
  }

  // Update the post (increment shares and add user to sharedBy)
  const updated = await Post.findByIdAndUpdate(
    postId,
    {
      $inc: { shares: 1 },
      $addToSet: { sharedBy: userId }
    },
    { new: true }
  );

  if (!updated) throw new appError('Post not found', 404);

  // Populate likes and comments
  const post = await Post.findById(postId)
    .populate({
    path: 'likes',
    select: 'name profilePicture' 
    })    
    .populate({
      path: 'comments',
      populate: {
        path: 'user',     
        select: 'name profilePicture' 
      }
    });

  // Update the user's sharedPosts array
  await User.findByIdAndUpdate(
    userId,
    { $addToSet: { sharedPosts: postId } }
  );

  return post;
};


export const undoSharePost = async (postId, userId) => {
  // Check if user actually shared this post
  const hasShared = await Post.findOne({
    _id: postId,
    sharedBy: userId
  });

  if (!hasShared) {
    throw new appError('You have not shared this post', 400);
  }

  // Update the post (decrement shares and remove user from sharedBy)
  const post = await Post.findByIdAndUpdate(
    postId,
    {
      $inc: { shares: -1 },
      $pull: { sharedBy: userId }
    },
    { new: true }
  );

  if (!post) throw new appError('Post not found', 404);

  // Update the user's sharedPosts array
  await User.findByIdAndUpdate(
    userId,
    { $pull: { sharedPosts: postId } }
  );

  return post;
};