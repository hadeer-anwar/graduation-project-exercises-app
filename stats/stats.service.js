import User from '../user/model/user.model.js'
import Exercise from './../exercise/model/exercise.model.js';
import Session from '../challenge/model/Session.model.js'
import Post from '../community/model/post.model.js'
import UserExerciseProgress from '../user/model/userExerciseProgress.model.js'

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

  // Aggregate totals: likes, comments, shares
  const totals = await Post.aggregate([
    {
      $group: {
        _id: null,
        totalLikes: { $sum: { $size: "$likes" } },
        totalComments: { $sum: { $size: "$comments" } },
        totalShares: { $sum: { $size: "$sharedBy" } }
      }
    }
  ]);

  const totalLikes = totals[0]?.totalLikes || 0;
  const totalComments = totals[0]?.totalComments || 0;
  const totalShares = totals[0]?.totalShares || 0;

  // Most liked post
  const mostLikedPost = await Post.findOne()
    .sort({ "likes.length": -1 }) // If likes is an array
    .populate("user", "name profilePic")
    .lean();

  // Most shared post
  const mostSharedPost = await Post.findOne()
    .sort({ "sharedBy.length": -1 }) // If sharedBy is an array
    .populate("user", "name profilePic")
    .lean();

  // Most active user
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
    totalLikes,
    totalComments,
    totalShares,
    mostLikedPost,
    mostSharedPost,
    mostActiveUser: mostActiveUserAgg[0] || null
  };
};

export const getGlobalExerciseTimeStatsService = async () => {
  const result = await UserExerciseProgress.aggregate([
    {
      $project: {
        hour: { $hour: "$createdAt" } // extract hour (0–23)
      }
    },
    {
      $group: {
        _id: "$hour",
        count: { $sum: 1 }
      }
    },
    {
      $sort: { _id: 1 }
    },
    {
      $project: {
        hour: "$_id",
        count: 1,
        _id: 0
      }
    }
  ]);

  return result;
};



export const getUserGrowthByMonth = async () => {
  const [growthByMonth, nullDateCount] = await Promise.all([
    // Group users with valid createdAt
    User.aggregate([
      {
        $match: {
          createdAt: { $ne: null }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m", date: "$createdAt" }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          month: "$_id",
          count: 1,
          _id: 0
        }
      }
    ]),

    // Count users with null or missing createdAt
    User.countDocuments({ createdAt: null })
  ]);

  // Optional: Add the null count as "Unknown"
  if (nullDateCount > 0) {
    growthByMonth.unshift({
      month: "Unknown",
      count: nullDateCount
    });
  }

  return growthByMonth;
};
