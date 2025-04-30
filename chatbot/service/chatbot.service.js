import { GoogleGenerativeAI } from "@google/generative-ai";
import appError from "../../utils/appError.js";
import FitnessChat from "../model/chatbot.model.js";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const getFitnessBotReply = async (userMessage) => {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
    You are a certified personal trainer and nutritionist.
    Only respond to fitness or health-related questions.
    If a user asks anything else, reply: "I'm here to help with fitness and nutrition. Please ask a related question!"

    User: ${userMessage}
  `;

  try {
    const result = await model.generateContent(prompt);
    const reply = result?.response?.text();
    return reply || "Sorry, I couldn’t generate a helpful response.";
  } catch (error) {
    console.error("Gemini SDK Error:", error.message || error);
    throw new appError("Gemini service failed.");
  }
};



// Service function to get all chats by userId
export const getUserChats = async (userId) => {
  const chat = await FitnessChat.findOne({ userId });

  if (!chat) {
    throw new appError("No chats found for this user.");
  }

  return chat;
};