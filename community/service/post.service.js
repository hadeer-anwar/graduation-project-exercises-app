import Post from '../model/post.model.js';
import appError from '../../utils/appError.js'
export const createPost = async (userId, postData) => {
  const { content, videoUrls = [], imageUrls = [] } = postData;
  
  return await Post.create({ 
    user: userId, 
    content,
    videoUrls,
    imageUrls
  });
};

export const getAllPosts = async () => {
  return await Post.find().populate('user', 'name').sort({ createdAt: -1 });
};

export const getPostById = async (postId) => {
  return await Post.findById(postId).populate('user', 'name');
};

export const deletePost = async (postId, userId) => {
  const post = await Post.findById(postId);
  if (!post) throw new Error('Post not found');
  
  // Compare string representations
  if (post.user.toString() !== userId.toString()) {
    throw new Error('Not authorized');
  }
  
  return await post.deleteOne();
};

export const getPostWithComments = async (postId) => {
  return await Post.findById(postId)
    .populate({
      path: 'comments',
      populate: [
        {
          path: 'user',
          select: 'name avatar'
        },
        {
          path: 'replies',
          populate: {
            path: 'user',
            select: 'name avatar'
          }
        }
      ]
    })
    .populate('user', 'name avatar')
    .populate('likes', 'name avatar');
};