import User from "../model/user.model.js";
import appError from '../../utils/appError.js'
import generateToken from "../../utils/generateToken.js";
import bcrypt from 'bcryptjs';
import {sendNotification} from '../../utils/sendNotification.js'

// add user

export const addUser = async (data) =>{
  const user = await User.create(data);
  if(!user) 
    throw new appError('Can not create user');  
  
  return {
    user,
    token :generateToken({_id:user._id , email:user.email, role: user.role})
}
}

//login 

export const userLogin = async(email, password)=>{
  const user = await User.findOne({email}).select("+password");   
   
  // console.log("user login ",user)

  if(!user)
      throw new appError("User Not Found", 404);
  const isMatch = await user.matchPassword(password);
  
  if(!isMatch)
      throw new appError("Invalid Credentials", 401);
  return {
      user,
      token :generateToken({_id:user._id , email:user.email, role: user.role})
  }
}

export const adminLogin = async (email, password) => {
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new appError("User Not Found", 404);
  }

  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    throw new appError("Invalid Credentials", 401);
  }

  if (user.role !== "admin") {
    throw new appError("Access denied. Not an admin.", 403);
  }

  return {
    user,
    token: generateToken({
      _id: user._id,
      email: user.email,
      role: user.role
    }),
  };
};


// update user info 

export const userUpdate = async(id, data)=>{
   const user = User.findByIdAndUpdate(id, data, {new: true});
   if(!user)
     throw new appError("Can't update user information");
   return user;
}


export const checkCurrentPassword = async (userId, currentPassword) => {
 

  const user = await User.findById(userId);
  if (!user) {
    throw new appError("User not found", 404);
  }

  const isCorrect = await bcrypt.compare(currentPassword, user.password);
  if (!isCorrect) {
    throw new appError("Incorrect current password", 400);
  }

  return user; 
};

/**
 * Update user password
 */
export const updateUserPassword = async (userId, newPassword) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new appError("User not found", 404);
  }

  // Hash new password
  user.password = await bcrypt.hash(newPassword, 10);
  user.passwordChangedAt = Date.now();
  await user.save();

  return {
     message: "Password updated successfully",
    token :generateToken({_id:user._id , email:user.email, role: user.role})
   };
}; 

export const userUpdatePassword = async (id, data)=>{
  const user = await User.findByIdAndUpdate(id, data, {new: true});
  if(!user)
    throw new appError("Can't update password");
  return {
    user,
    token :generateToken({_id:user._id , email:user.email, role: user.role})
}
}
// get all users 

export const getAllUsers = async ()=>{
  const usersList = await User.find();

  if(!usersList)
    throw new appError("Can't get users")
  return usersList
}

// get user by id
export const getUserById = async (id) => {
  const user = await User.findById(id)
    .populate('followers', 'name email profilePicture')     
    .populate('following', 'name email profilePicture');

  if (!user)
    throw new appError("User not found");

  return user;
};

// delete user 
export const deleteUserById = async (id)=>{
 
  const user = await User.findByIdAndDelete(id);

  if(!user)
    throw new appError('User not found')
  return user
}

export const changeRole = async (id, data)=>{

  const user = await User.findByIdAndUpdate(id,data, {new: true});

  if(!user)
    throw new appError("Can't change role");

  return user
}



export const followUser = async (currentUserId, targetUserId) => {
  if (currentUserId === targetUserId) throw new appError("You can't follow yourself");

  const currentUser = await User.findById(currentUserId);
  const targetUser = await User.findById(targetUserId);

  if (!currentUser || !targetUser) throw new appError("User not found");

  if (!currentUser.following.includes(targetUserId)) {
    currentUser.following.push(targetUserId);
    targetUser.followers.push(currentUserId);

    sendNotification({
  recipient: targetUserId,
  sender: currentUserId,
  type: 'follow'
});

    await currentUser.save();
    await targetUser.save();
  }

  return targetUser;
};

export const unfollowUser = async (currentUserId, targetUserId) => {
  const currentUser = await User.findById(currentUserId);
  const targetUser = await User.findById(targetUserId);

  if (!currentUser || !targetUser) throw new appError("User not found");

  currentUser.following = currentUser.following.filter(id => id.toString() !== targetUserId);
  targetUser.followers = targetUser.followers.filter(id => id.toString() !== currentUserId);

  await currentUser.save();
  await targetUser.save();

  return targetUser;
};




export const createAdminUser = async ({ name, email, password, gender, age }) => {
  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new appError("User with this email already exists.");
  }

  const newAdmin = new User({
    name,
    email,
    password,
    gender,
    age,
    role: "admin",
  });

  await newAdmin.save();
  return newAdmin;
};

// change profile picture
export const changeProfilePicture = async (userId, imageUrl) => {
  const user = await User.findById(userId);
  if (!user) {
  throw new appErrro("user not found")
  }

  user.profilePic = imageUrl;
  await user.save();
  return user;
};

export const getFollowers = async (userId) => {
  const user = await User.findById(userId).populate('followers', 'name email profilePic');
  if (!user) throw new appError('User not found', 404);
  return user.followers;
};

export const getFollowing = async (userId) => {
  const user = await User.findById(userId).populate('following', 'name email profilePic');
  if (!user) throw new appError('User not found', 404);
  return user.following;
};

