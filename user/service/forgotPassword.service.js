import User from "../model/user.model.js";
import { generateResetCode, hashResetCode } from "../../utils/generateResetCode.js";
import appError from "../../utils/appError.js";
import { sendEmail } from "../../utils/emailService.js";
import bcrypt from 'bcryptjs'
import generateToken from '../../utils/generateToken.js'


export const ForgotPassword = async (email) => {
    
    const user = await User.findOne({ email });
    if (!user) {
      throw new appError('User not found with this email', 404);
    }
  
    const resetCode = generateResetCode();
    const resetCodeExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes expiry
  
    user.resetCode = hashResetCode(resetCode);
    user.resetCodeExpiry = resetCodeExpiry;
    await user.save();
  
    await sendEmail(
      email,
      'Password Reset Code',
      `Your password reset code is: ${resetCode} \n NOTE: this code expires after 10 minutes `
    );
  
    return  'Reset code sent to your email';
  };
  
  export const checkResetCode = async (email, resetCode) => {
    const user = await User.findOne({ email });
    if (!user || !user.resetCode || !user.resetCodeExpiry) {
      throw new appError("Invalid or expired reset code", 400);
    }
  
    if (user.resetCodeExpiry < Date.now()) {
      throw new appError("Reset code has expired", 400);
    }
  
    const hashedResetCode = hashResetCode(resetCode);
    if (hashedResetCode !== user.resetCode) {
      throw new appError("Invalid reset code", 400);
    }
  
    return { message: "Reset code is valid" };
  };
  
  export const resetPassword = async (email, newPassword) => {
    const user = await User.findOne({ email });
    if (!user) {
      throw new appError("User not found", 404);
    }
    
    user.password = newPassword
    user.resetCode = undefined;
    user.resetCodeExpiry = undefined;
    await user.save();
  
    return {
      message: "Password reset successful",
      token: generateToken({ _id: user._id, email: user.email, role: user.role }),
    };
  };
  