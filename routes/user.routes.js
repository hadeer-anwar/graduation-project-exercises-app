import express from "express"
import { changePassword,
         changeUserRole,
         deleteOneUser, 
         getMyProfile, 
         getOneUser, 
         getUsers, 
         updateUser, 
         userSignin, 
         userSignup } from "../user/controller/user.controller.js";

import { authToken } from "../middlewares/authToken.js";



import { userValidator, passwordValidator, userUpdateValidator } from "../middlewares/userValidator.js";

import {authorizeRole} from '../middlewares/authorizeRole.js';
import { forgotPassword, resetPassword } from "../user/controller/forgotPassword.controller.js";

const userRouter = express.Router();

userRouter.post("/signup",userValidator, userSignup);
userRouter.post("/login", userSignin);
userRouter.put("/:id", authToken, userUpdateValidator, updateUser);
userRouter.put("/change-password/:id", authToken, passwordValidator, changePassword)

userRouter.post("/forgot-password", forgotPassword)
userRouter.post("/reset-password", resetPassword)
userRouter.get("/my-profile", authToken, getMyProfile)


userRouter.get("/", authToken, authorizeRole("admin"), getUsers)
userRouter.get("/:id", authToken, authorizeRole("admin"), getOneUser)
userRouter.delete("/:id", authToken, authorizeRole("admin"), deleteOneUser )
userRouter.put("/changeRole/:id", authToken, authorizeRole("admin"), changeUserRole)
userRouter.put("")
export default userRouter;
