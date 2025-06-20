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

    const newPost = await Post.create({ 
        user: userId, 
        content,
        videoUrls: validVideoUrls,
        imageUrls: validImageUrls
    });

  await User.findByIdAndUpdate(userId, {
  $push: { posts: newPost._id }
});
return newPost;
};

export const getAllPosts = async () => {
    return await Post.find()
        .populate('user', 'name email profilePic')
        .populate('likes', 'name email profilePic')
        .populate('sharedBy', 'name email profilePic') 
        .populate({
            path: 'comments',
            populate: [
                {
                    path: 'user',
                    select: 'name email profilePic'
                },
                {
                    path: 'replies',
                    populate: {
                        path: 'user',
                        select: 'name email profilePic'
                    }
                }
            ]
        })
        .sort({ createdAt: -1 });
};

export const getPostById = async (postId) => {
    const post = await Post.findById(postId)
        .populate('user', 'name email profilePic')
        .populate('likes', 'name email profilePic')
        .populate('sharedBy', 'name email profilePic') 
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
                    select: 'name email profilePic'
                },
                {
                    path: 'replies',
                    populate: {
                        path: 'user',
                        select: 'name email profilePic'
                    }
                }
            ]
        })
        .populate('user', 'name email profilePic')
        .populate('likes', 'name email profilePic')
        .populate('sharedBy', 'name email profilePic') 
};

export const getUserCreatedPosts = async (userId) => {
  return await Post.find({ user: userId })
    .sort({ createdAt: -1 })
    .populate('user', 'name email profilePic')
    .populate('likes', 'name email profilePic')
    .populate('sharedBy', 'name email profilePic') 
    .populate({
      path: 'comments',
      populate: [
        {
          path: 'user',
          select: 'name email profilePic'
        },
        {
          path: 'replies',
          populate: {
            path: 'user',
            select: 'name email profilePic'
          }
        }
      ]
    });
};


export const getUserSharedPosts = async (userId) => {
    const user = await User.findById(userId).populate({
        path: 'sharedPosts',
        populate: [
            { path: 'user', select: 'name email profilePic' },
            { path: 'likes', select: 'name email profilePic' },
            { path: 'comments' ,    populate: [
        {
          path: 'user',
          select: 'name email profilePic'
        },
        {
          path: 'replies',
          populate: {
            path: 'user',
            select: 'name email profilePic'
          }
        }
      ]}
        ]
    })
    
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
       .populate('user', 'name email profilePic')
    .populate('likes', 'name email profilePic')
    .populate('sharedBy', 'name email profilePic') 
    .populate({
      path: 'comments',
      populate: [
        {
          path: 'user',
          select: 'name email profilePic'
        },
        {
          path: 'replies',
          populate: {
            path: 'user',
            select: 'name email profilePic'
          }
        }
      ]
    })
};


export const getPostsFromFollowing = async (userId) => {
  const user = await User.findById(userId);

  if (!user) throw new appError('User not found');

  const posts = await Post.find({ user: { $in: user.following } })
    .populate('user', 'name email profilePic')
    .populate('likes', 'name email profilePic')
    .populate('sharedBy', 'name email profilePic') 
    .populate({
      path: 'comments',
      populate: [
        {
          path: 'user',
          select: 'name email profilePic'
        },
        {
          path: 'replies',
          populate: {
            path: 'user',
            select: 'name email profilePic'
          }
        }
      ]
    })
    .sort({ createdAt: -1 });

  return posts;
};
