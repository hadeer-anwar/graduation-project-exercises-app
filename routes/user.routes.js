import express from "express"
import { changePassword,
         changeUserRole,
         deleteOneUser, 
         getMyProfile, 
         getOneUser, 
         getUsers, 
         updateUser, 
         userSignin, 
         userSignup,
         adminSignin,
         follow,
         unfollow,
         addAdmin,
         changeProfilePic,
         getUserFollowers,
         getUserFollowing,
         getTopTenUsers,
         }
         from "../user/controller/user.controller.js";

import { authToken } from "../middlewares/authToken.js";



import { userValidator, passwordValidator } from "../middlewares/userValidator.js";

import {authorizeRole} from '../middlewares/authorizeRole.js';
import { checkResetCodeController, forgotPassword, resetPasswordController } from "../user/controller/forgotPassword.controller.js";
import { uploadFiles } from "../cloudinary/cloudinaryConfig.js";

const userRouter = express.Router();

userRouter.post("/signup",userValidator, userSignup);
userRouter.post("/login", userSignin);
userRouter.post("/admin-login", adminSignin);
userRouter.put("/change-password", authToken, passwordValidator, changePassword)
userRouter.post("/forgot-password", forgotPassword)
userRouter.post("/check-otp", checkResetCodeController)
userRouter.post("/reset-password", resetPasswordController)
userRouter.get("/my-profile", authToken, getMyProfile)
userRouter.get("/followers/:id", getUserFollowers);
userRouter.get("/following/:id", getUserFollowing);
userRouter.get('/top-users', getTopTenUsers);

userRouter.put("/update-info", authToken, updateUser);

userRouter.put("/changeRole/:id", authToken, authorizeRole("admin"), changeUserRole)
userRouter.post("/follow/:id", authToken, follow)
userRouter.post("/unfollow/:id", authToken, unfollow)
userRouter.post("/admin/add", authToken, authorizeRole("admin"), addAdmin);
userRouter.patch(
  "/profile-picture",
  authToken,
  uploadFiles.single("image"), 
  changeProfilePic
);
userRouter.get("/followers/:id",  getUserFollowers);
userRouter.get("/following/:id",  getUserFollowing);

userRouter.get("/",  getUsers)
userRouter.get("/:id", getOneUser)
userRouter.patch("/:id", updateUser )
userRouter.delete("/:id", authToken, deleteOneUser )

export default userRouter;

 
