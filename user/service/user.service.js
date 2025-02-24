import User from "../model/user.model.js";
import appError from '../../utils/appError.js'
import generateToken from "../../utils/generateToken.js";
import bcrypt from 'bcrypt';

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
export const getUserById = async (id)=>{
  const user = await User.findById(id);
  if(!user)
    throw new appError("User not found")
  return user
}

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



