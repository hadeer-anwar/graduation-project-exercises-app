import Post from '../model/post.model.js';

export const createPost = async (userId, content, image) => {
  return await Post.create({ user: userId, content, image });
};

export const getAllPosts = async () => {
  return await Post.find().populate('user', 'name').sort({ createdAt: -1 });
};

export const getPostById = async (postId) => {
  return await Post.findById(postId).populate('user', 'name');
};

export const deletePost = async (postId, userId) => {
  const post = await Post.findById(postId);
  if (post.user.toString() !== userId) throw new Error('Not authorized');
  return await post.deleteOne();
};
