import asyncWrapper from '../../middlewares/asyncWrapper.js'
import { ForgotPassword, ResetPassword } from '../service/forgotPassword.service.js';
const tokenOption = {
  httpOnly: true,     // prevent xss attack
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'Strict',   // prevent csrf attack
  maxAge: 7 * 24 * 60 * 60 * 1000, // Cookie valid for 7 days
}
export const forgotPassword = asyncWrapper(async (req, res) => {
    const { email } = req.body;
    const result = await ForgotPassword(email);
    res.status(200).json({
        success: true,
        error:false,
        message: result
      });
  });
  
  export const resetPassword = asyncWrapper(async (req, res) => {
    const { email, resetCode, newPassword } = req.body;
    const result = await ResetPassword(email, resetCode, newPassword);
    res.status(200).cookie("token",token,tokenOption).json({
        success: true,
        error:false,
        result
      });
  });