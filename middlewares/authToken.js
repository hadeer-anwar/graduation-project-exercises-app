import jwt from 'jsonwebtoken';
import appError from "../utils/appError.js";
import asyncWrapper from "./asyncWrapper.js";
import User from "../user/model/user.model.js"; 

export const authToken = asyncWrapper(async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    throw new appError("User not logged in", 401);
  }

  let decoded;
  try {
    // Verify the token synchronously
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      throw new appError("Token has expired", 401);
    }
    throw new appError("Invalid token", 401);
  }

  // Attach the user ID to the request
  req.user = { _id: decoded._id };

  // Check if the user exists in the database
  const currentUser = await User.findById(req.user._id);
  if (!currentUser) {
    throw new appError("This user doesn't exist", 401);
  }
 if(currentUser.passwordChangedAt){
  const passwordChangedTimestamp = parseInt(currentUser.passwordChangedAt.getTime() /1000, 10);
  if(passwordChangedTimestamp > decoded.iat ){
    throw new appError("Password changed, Login again", 401);
  }
 }  
  next(); // Proceed to the next middleware
});

