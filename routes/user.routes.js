import express from "express"
import { changePassword,
         changeUserRole,
         deleteOneUser, 
         getOneUser, 
         getUsers, 
         updateUser, 
         userSignin, 
         userSignup } from "../user/controller/user.controller.js";

import { authToken } from "../middlewares/authToken.js";

import { createUserValidator, 
         dynamicUserValidators, 
         passwordValidator } from "../validators/userValidator.js";

import { validatorMiddleware } from "../middlewares/validator.js";

import {authorizeRole} from '../middlewares/authorizeRole.js';
import { forgotPassword, resetPassword } from "../user/controller/forgotPassword.controller.js";

const userRouter = express.Router();

userRouter.post("/signup",createUserValidator,validatorMiddleware, userSignup);
userRouter.post("/login", userSignin);
userRouter.put("/:id", authToken, dynamicUserValidators, validatorMiddleware, updateUser);
userRouter.put("/change-password/:id", authToken, passwordValidator, validatorMiddleware, changePassword)
userRouter.get("/", authToken, authorizeRole("admin"), getUsers)
userRouter.get("/:id", authToken, authorizeRole("admin"), getOneUser)
userRouter.delete("/:id", authToken, authorizeRole("admin"), deleteOneUser )
userRouter.put("/changeRole/:id", authToken, authorizeRole("admin"), changeUserRole)
userRouter.post("/forgot-password", forgotPassword)
userRouter.post("/reset-password", resetPassword)
export default userRouter;