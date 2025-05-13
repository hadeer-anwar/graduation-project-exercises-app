import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
  sessionId: { type: String, required: true, unique: true },
  host: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  challenges: [{ type: mongoose.Schema.Types.ObjectId, ref: "Challenge" }],
  status: { type: String, enum: ["waiting", "active", "completed"], default: "waiting" },
  startTime: { type: Date },
}, { timestamps: true });

export default mongoose.model("Session", sessionSchema);