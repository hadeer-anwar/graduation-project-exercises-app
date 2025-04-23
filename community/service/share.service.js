import appError from "../../utils/appError.js";
import Post from "../model/post.model.js";

export const sharePost = async (postId) => {
  const post = await Post.findByIdAndUpdate(
    postId,
    { $inc: { shares: 1 } },
    { new: true }
  );
  if (!post) throw new appError('Post not found');
  return post;
};