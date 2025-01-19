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