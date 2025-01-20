import User from "../model/user.model.js";
import appError from '../../utils/appError.js'
import generateToken from "../../utils/generateToken.js";


// add user

export const addUser = async (data) =>{
  const user = await User.create(data);
  if(!user) 
    throw new appError('Can not create user');  
  
  return user;
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
      token :generateToken({_id:user._id , email:user.email})
  }
}