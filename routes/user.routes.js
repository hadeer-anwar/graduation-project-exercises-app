import express from "express"
import { userSignup } from "../user/controller/user.controller.js";
import { authToken } from "../middlewares/authToken.js";

const userRouter = express.Router();
userRouter.post("/signup" , userSignup);

export default userRouter;