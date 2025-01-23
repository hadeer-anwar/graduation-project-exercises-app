import asyncWrapper from '../../middlewares/asyncWrapper.js'
import { ForgotPassword, ResetPassword } from '../service/forgotPassword.service.js';

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
    res.status(200).json({
        success: true,
        error:false,
        message: result
      });
  });