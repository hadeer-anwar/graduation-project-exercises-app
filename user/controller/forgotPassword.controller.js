import asyncWrapper from '../../middlewares/asyncWrapper.js'
import { ForgotPassword, resetPassword , checkResetCode} from '../service/forgotPassword.service.js';
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
  
// Validate Reset Code
export const checkResetCodeController = asyncWrapper(async (req, res) => {
  const { email, resetCode } = req.body;

  await checkResetCode(email, resetCode);

  res.status(200).json({
    success: true,
    error: false,
    message: "Reset code is valid",
  });
});

// Reset Password
export const resetPasswordController = asyncWrapper(async (req, res) => {
  const { email, newPassword } = req.body;

  const result = await resetPassword(email, newPassword);

  res.status(200).cookie("token", result.token, tokenOption).json({
    success: true,
    error: false,
    result,
  });
});
