import User from '../user/model/user.model.js'
import Exercise from './../exercise/model/exercise.model.js';
import Session from '../challenge/model/Session.model.js'
import Post from '../community/model/post.model.js'

export const getStats = async () => {
  const [userCount, adminCount, exerciseCount, completedSessions, males, females ] = await Promise.all([
    User.countDocuments({ role: 'user' }),
    User.countDocuments({ role: 'admin' }),
    Exercise.countDocuments(),
    Session.countDocuments({ status: 'completed' }),
    User.countDocuments({ gender: 'male' }),
    User.countDocuments({ gender: 'female' }),
  ]);

  return {
    users: userCount,
    admins: adminCount,
    exercises: exerciseCount,
    completedSessions,
    males:males,
    females: females,
  };
};


export const getUserAgeStats = async () => {
  const users = await User.aggregate([
    {
      $bucket: {
        groupBy: '$age',
        boundaries: [0, 18, 26, 36, 46, 56, 66, 100],
        default: 'Unknown',
        output: { count: { $sum: 1 } }
      }
    }
  ]);

  return users.map((group) => ({
    range:
      group._id === 'Unknown'
        ? 'Unknown'
        : group._id === 0
        ? 'Under 18'
        : `${group._id}-${group._id + 9}`,
    count: group.count
  }));
};

export const getCommunityStats = async () => {
  const totalPosts = await Post.countDocuments();

  const mostLikedPost = await Post.findOne()
    .sort({ "likes.length": -1 }) // or .sort({ likes: -1 }) if likes is a number
    .populate("user", "name profilePic")
    .lean();

  const mostSharedPost = await Post.findOne()
    .sort({ "sharedBy.length": -1 }) // or .sort({ shares: -1 }) if shares is a number
    .populate("user", "name profilePic")
    .lean();

  const mostActiveUserAgg = await Post.aggregate([
    {
      $group: {
        _id: "$user",
        postCount: { $sum: 1 }
      }
    },
    { $sort: { postCount: -1 } },
    { $limit: 1 },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "user"
      }
    },
    { $unwind: "$user" },
    {
      $project: {
        _id: "$user._id",
        name: "$user.name",
        profilePic: "$user.profilePic",
        postCount: 1
      }
    }
  ]);

  return {
    totalPosts,
    mostLikedPost,
    mostSharedPost,
    mostActiveUser: mostActiveUserAgg[0] || null
  };
};
