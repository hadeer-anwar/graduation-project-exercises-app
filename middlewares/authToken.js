import appError from "../utils/appError.js";
import asyncWrapper from "./asyncWrapper.js";
import jwt from 'jsonwebtoken';

export const authToken = asyncWrapper(async (req, res, next) => {
  // Retrieve token from cookies or headers
  const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];
  
  console.log("Token received:", token); // For debugging

  if (!token) {
    throw new appError("User not logged in", 401);
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.log("JWT verification error:", err); // Debugging log
      throw new appError("Invalid token", 401);
    }
    
    // Initialize req.user and set the id from decoded token
    req.user = { id: decoded._id }; 
    console.log("Decoded user:", req.user); // For debugging

    next();
  });
});