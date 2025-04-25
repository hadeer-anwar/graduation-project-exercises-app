import mongoose from "mongoose";

const fitnessChatSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  messages: [
    {
      sender: { type: String, enum: ["user", "bot"], required: true },
      text: { type: String, required: true },
      time: { type: Date, default: Date.now },
    },
  ],
}, { timestamps: true });

const FitnessChat = mongoose.model("FitnessChat", fitnessChatSchema);
export default FitnessChat;
