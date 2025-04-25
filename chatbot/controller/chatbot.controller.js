import FitnessChat from '../model/chatbot.model.js'
import {getFitnessBotReply, getUserChats} from '../service/chatbot.service.js'
import asyncWrapper from '../../middlewares/asyncWrapper.js'

export const askFitnessBot = asyncWrapper(async (req, res, next) => {
  const { message } = req.body;
  const userId = req.user?._id; 

  const botReply = await getFitnessBotReply(message);

  // Save to DB
  const newChat = await FitnessChat.create({
    userId,
    messages: [
      { sender: "user", text: message },
      { sender: "bot", text: botReply },
    ],
  });

  res.status(200).json({
    reply: botReply,
    chat: newChat,
  });
});


export const getallUserChats = asyncWrapper( async (req, res, next) => {
  const { userId } = req.params;

   const chat = await getUserChats(userId);

    res.status(200).json({
      status: "success",
      data: chat,
    })

});
