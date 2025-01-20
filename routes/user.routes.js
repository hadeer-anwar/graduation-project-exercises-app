import express from "express"
import { userSignin, userSignup } from "../user/controller/user.controller.js";
import { authToken } from "../middlewares/authToken.js";

const userRouter = express.Router();
userRouter.post("/signup", userSignup);
userRouter.post("/login", userSignin);


export default userRouter;