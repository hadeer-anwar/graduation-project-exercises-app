import express from "express";
const chatbotRouter = express.Router();
import {askFitnessBot, getallUserChats} from '../chatbot/controller/chatbot.controller.js'
import { authToken } from "../middlewares/authToken.js";
import { messageValidator } from "../middlewares/messageValidator.js";


chatbotRouter.post("/ask", authToken, messageValidator, askFitnessBot);
chatbotRouter.get("/user-chats/:userId", getallUserChats);


export default chatbotRouter;
