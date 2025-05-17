import Post from '../model/post.model.js';
import User from '../../user/model/user.model.js';
import appError from '../../utils/appError.js';

export const createPost = async (userId, postData) => {
    const { content, videoUrls = [], imageUrls = [] } = postData;
    console.log("df",postData)
    // Validate URLs if needed
    const validateUrl = (url) => {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    };

    const validImageUrls = imageUrls.filter(url => validateUrl(url));
    const validVideoUrls = videoUrls.filter(url => validateUrl(url));

    return await Post.create({ 
        user: userId, 
        content,
        videoUrls: validVideoUrls,
        imageUrls: validImageUrls
    });
};

export const getAllPosts = async () => {
    return await Post.find()
        .populate('user', 'name email profilePicture')
        .populate('likes', 'name email profilePicture')
        .populate('comments')
        .sort({ createdAt: -1 });
};

export const getPostById = async (postId) => {
    const post = await Post.findById(postId)
        .populate('user', 'name email profilePicture')
        .populate('likes', 'name email profilePicture')
        .populate('comments');
    
    if (!post) throw new appError('Post not found', 404);
    return post;
};

export const deletePost = async (postId, userId) => {
    const post = await Post.findById(postId);
    if (!post) throw new appError('Post not found', 404);
    
    if (post.user.toString() !== userId.toString()) {
        throw new appError('Not authorized to delete this post', 403);
    }
    
    await post.deleteOne();
    return true;
};

export const getPostWithComments = async (postId) => {
    return await Post.findById(postId)
        .populate({
            path: 'comments',
            populate: [
                {
                    path: 'user',
                    select: 'name email profilePicture'
                },
                {
                    path: 'replies',
                    populate: {
                        path: 'user',
                        select: 'name email profilePicture'
                    }
                }
            ]
        })
        .populate('user', 'name email profilePicture')
        .populate('likes', 'name email profilePicture');
};

export const getUserCreatedPosts = async (userId) => {
  return await Post.find({ user: userId })
    .sort({ createdAt: -1 })
    .populate('user', 'name email profilePicture')
    .populate('likes', 'name email profilePicture')
    .populate({
      path: 'comments',
      populate: [
        {
          path: 'user',
          select: 'name email profilePicture'
        },
        {
          path: 'replies',
          populate: {
            path: 'user',
            select: 'name email profilePicture'
          }
        }
      ]
    });
};


export const getUserSharedPosts = async (userId) => {
    const user = await User.findById(userId).populate({
        path: 'sharedPosts',
        populate: [
            { path: 'user', select: 'name email profilePicture' },
            { path: 'likes', select: 'name email profilePicture' },
            { path: 'comments' }
        ]
    });
    
    if (!user) throw new appError('User not found', 404);
    return user.sharedPosts || [];
};



export const getAllUserPosts = async (userId) => {
    const [createdPosts, sharedPosts] = await Promise.all([
        getUserCreatedPosts(userId),
        getUserSharedPosts(userId)
    ]);
    
    return {
        createdPosts,
        sharedPosts,
        allPosts: [...createdPosts, ...sharedPosts].sort((a, b) => 
            new Date(b.createdAt) - new Date(a.createdAt))
    };
};


export const updatePost = async (postId, userId, updateData) => {
    const post = await Post.findById(postId);
    if (!post) throw new appError('Post not found', 404);

    // Only the original creator can edit the post
    if (post.user.toString() !== userId.toString()) {
        throw new appError('Not authorized to edit this post', 403);
    }

    const { content, imageUrls, videoUrls } = updateData;

    // Validate and apply updates
    if (content !== undefined) post.content = content;
    if (Array.isArray(imageUrls)) post.imageUrls = imageUrls;
    if (Array.isArray(videoUrls)) post.videoUrls = videoUrls;

    await post.save();

    return await Post.findById(postId)
        .populate('user', 'name email profilePicture')
        .populate('likes', 'name email profilePicture')
        .populate({
            path: 'comments',
            populate: {
                path: 'user',
                select: 'name profilePicture'
            }
        });
};
