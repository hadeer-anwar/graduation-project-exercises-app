import User from '../user/model/user.model.js'
import Exercise from './../exercise/model/exercise.model.js';
import Session from '../challenge/model/Session.model.js'

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

