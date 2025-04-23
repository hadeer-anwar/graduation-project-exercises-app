import appError from "../../utils/appError.js";
import Post from "../model/post.model.js";

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



