import appError from "../../utils/appError.js";
import Post from "../model/post.model.js";
import Comment from '../model/comment.model.js'
import { sendNotification } from "../../utils/sendNotification.js";

export const getCommentsByPostId = async (postId) => {
  const post = await Post.findById(postId)
    .populate({
      path: 'comments',
      populate: [
        {
          path: 'user',
          select: 'name avatar' // Only include name and avatar
        },
        {
          path: 'replies',
          populate: [
            {
              path: 'user',
              select: 'name avatar'
            },
            {
              path: 'replies', // For nested replies
              populate: {
                path: 'user',
                select: 'name avatar'
              }
            }
          ]
        }
      ]
    });

  if (!post) {
    throw new appError('Post not found', 404);
  }

  return post.comments;
};





export const addComment = async (postId, userId, content) => {
  const post = await Post.findById(postId);
  
  if (!post) throw new appError('Post not found');
  
  const comment = new Comment({
    user: userId,
    content
  })

  await comment.save();
  post.comments.push(comment._id);
  await post.save();

    await sendNotification({
    recipient: post.user,
    sender: userId,
    type: 'comment',
    post: post._id
  });
  
  return { post, comment };

}

export const replyToComment = async (commentId, userId, content) => {
  const parentComment = await Comment.findById(commentId);
  if (!parentComment) throw new Error('Comment not found');
  
  const reply = new Comment({
    user: userId,
    content
  });
  
  await reply.save();
  parentComment.replies.push(reply._id);
  await parentComment.save();
  
  return reply;
};



export const editComment = async (commentId, userId, content) => {
  const comment = await Comment.findOneAndUpdate(
    {
      _id: commentId,
      user: userId // Only allow update if user matches
    },
    { content },
    { new: true, runValidators: true }
  );

  if (!comment) {
    throw new appError('Comment not found or you are not authorized to edit it', 404);
  }

  return comment;
};

export const deleteComment = async (commentId, userId) => {
  // Find the comment and verify ownership
  const comment = await Comment.findOne({
    _id: commentId,
    user: userId
  });

  if (!comment) {
    throw new appError('Comment not found or you are not authorized to delete it', 404);
  }

  // Remove comment reference from post or parent comment
  // Check if this is a top-level comment (in a post)
  const postWithComment = await Post.findOneAndUpdate(
    { comments: commentId },
    { $pull: { comments: commentId } },
    { new: true }
  );

  // If not found in post, check if it's a reply to another comment
  if (!postWithComment) {
    await Comment.findOneAndUpdate(
      { replies: commentId },
      { $pull: { replies: commentId } }
    );
  }

  // Finally delete the comment itself
  await comment.deleteOne();

  return { success: true };
};