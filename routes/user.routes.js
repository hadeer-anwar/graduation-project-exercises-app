import express from "express"
import { changePassword, updateUser, userSignin, userSignup } from "../user/controller/user.controller.js";
import { authToken } from "../middlewares/authToken.js";
import { createUserValidator, dynamicUserValidators, passwordValidator } from "../validators/userValidator.js";
import { validatorMiddleware } from "../middlewares/validator.js";

const userRouter = express.Router();

userRouter.post("/signup",createUserValidator,validatorMiddleware, userSignup);
userRouter.post("/login", userSignin);
userRouter.put("/:id",dynamicUserValidators, validatorMiddleware, updateUser);
userRouter.put("/changePassword/:id", passwordValidator, validatorMiddleware, changePassword)


export default userRouter;