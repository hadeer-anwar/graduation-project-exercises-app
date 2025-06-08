import asyncWrapper from '../../middlewares/asyncWrapper.js'
import bcrypt from 'bcryptjs' 

import { 
  addUser, 
  changeRole, 
  deleteUserById, 
  getAllUsers, 
  getUserById,
  userLogin, 
  userUpdate, 
  checkCurrentPassword, 
  updateUserPassword ,
  adminLogin,
  followUser,
  unfollowUser,
  createAdminUser,
  changeProfilePicture
} from '../service/user.service.js'

const tokenOption = {
  httpOnly: true,     // prevent xss attack
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'Strict',   // prevent csrf attack
  maxAge: 7 * 24 * 60 * 60 * 1000, // Cookie valid for 7 days
}

export const userSignup = asyncWrapper(async(req, res, next) => {
  let userData = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordChangedAt: req.body.passwordChangedAt,
    googleId: req.body.googleId,
    profilePic: req.body.profilePic,
    age: req.body.age,
    height: req.body.height,
    weight: req.body.weight,
    fitnessGoal: req.body.fitnessGoal,
    activityLevel: req.body.activityLevel,
    role: req.body.role
  }
  
  const { user, token } = await addUser(userData);

  res.status(201).cookie("token", token, tokenOption).json({
    success: true,
    message: "User Registered successfully",
    data: { user, token }
  })
})

export const userSignin = asyncWrapper(async (req, res, next) => {
  const { email, password } = req.body;
  const { user, token } = await userLogin(email, password);
  
  res.status(200).cookie("token", token, tokenOption).json({
    success: true,
    message: "User Logged In",
    data: { user, token }
  })
});

export const adminSignin = asyncWrapper(async (req, res, next) => {
  const { email, password } = req.body;

  const { user, token } = await adminLogin(email, password);

  res
    .status(200)
    .cookie("token", token, tokenOption)
    .json({
      success: true,
      message: "Admin Logged In",
      data: { user, token },
    });
});

export const updateUser = asyncWrapper(async (req, res, next) => {
  const { id } = req.params;
  let user = {
    name: req.body.name,
    email: req.body.email,
    profilePic: req.body.profilePic,
    age: req.body.age,
    height: req.body.height,
    weight: req.body.weight,
    fitnessGoal: req.body.fitnessGoal,
    activityLevel: req.body.activityLevel,
    points: req.body.points,
  }
  
  user = await userUpdate(id, user, { new: true });
  res.status(200).json({
    data: user,
    success: true,
    error: false,
    message: 'User updated successfully'
  });
})

export const changePassword = asyncWrapper(async (req, res, next) => {
  const { currentPassword, password, confirmPassword } = req.body;
  const userId = req.user._id; 

  // Check if current password is correct
  await checkCurrentPassword(userId, currentPassword);

  if (password !== confirmPassword) {
    return res.status(400).json({
      success: false,
      message: "Password confirmation failed",
    });
  }
    
  // Update password
  const response = await updateUserPassword(userId, password);
  
  res.status(200).json({
    success: true,
    message: "Password updated successfully",
  })
})

// Get all users
export const getUsers = asyncWrapper(async(req, res, next) => {
  const usersList = await getAllUsers();
  res.status(200).json({
    data: usersList,
    success: true,
    error: false,
    message: 'All Users'
  });
})

// Get user by id 
export const getOneUser = asyncWrapper(async (req, res, next) => {
  const user = await getUserById(req.params.id)
  res.status(200).json({
    data: user,
    success: true,
    error: false,
    message: ''
  });
})

// Delete user
export const deleteOneUser = asyncWrapper(async (req, res, next) => {
  const user = await deleteUserById(req.params.id)
  res.status(200).json({
    data: user,
    success: true,
    error: false,
    message: 'User Deleted successfully'
  });
})

export const changeUserRole = asyncWrapper(async (req, res, next) => {
  const user = await changeRole(req.params.id, { role: req.body.role });
  res.status(200).json({
    data: user,
    success: true,
    error: false,
    message: 'Role changed successfully'
  });
})

export const getMyProfile = asyncWrapper(async (req, res, next) => {
  const { _id } = req.user;
  const user = await getUserById(_id);

  res.status(200).json({
    data: user,
    success: true,
    error: false,
    message: ''
  });
})

// Uncommented and fixed logout function
export const logoutUser = asyncWrapper(async(req, res, next) => {
  res.cookie("token", "", {
    httpOnly: true, // Prevent XSS
    secure: process.env.NODE_ENV === "production", // Secure in production
    sameSite: "Strict", // Prevent CSRF
    expires: new Date(0), // Expire immediately
  });
  
  res.status(200).json({
    data: "",
    success: true,
    error: false,
    message: 'Logged out successfully'
  });
})


export const follow = asyncWrapper(async (req, res) => {
  const targetUserId = req.params.id;
  const currentUserId = req.user._id;

  const followed = await followUser(currentUserId, targetUserId);

  res.status(200).json({
    success: true,
    message: `You are now following ${followed.name}`,
    data: followed,
  });
});

export const unfollow = asyncWrapper(async (req, res) => {
  const targetUserId = req.params.id;
  const currentUserId = req.user._id;

  const unfollowed = await unfollowUser(currentUserId, targetUserId);

  res.status(200).json({
    success: true,
    message: `You unfollowed ${unfollowed.name}`,
    data: unfollowed,
  });
});

export const addAdmin = asyncWrapper ( async (req, res, next)=> {
  const newAdmin = await createAdminUser({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    gender: req.body.gender,
    age: req.body.age,
  })

   res.status(200).json({
    data: newAdmin,
    success: true,
    error: false,
    message: 'admin added successfully'
  });
})


export const changeProfilePic = async (req, res, next) => {
  try {
    const userId = req.user._id; 
    const file = req.file;

    if (!file || !file.path) {
      return res.status(400).json({ message: "No image file uploaded" });
    }

    const updatedUser = await changeProfilePicture(userId, file.path); // Cloudinary returns `path` as the secure URL
    res.status(200).json({ user: updatedUser, message: "Profile picture updated successfully" });
  } catch (error) {
    next(error);
  }
};
