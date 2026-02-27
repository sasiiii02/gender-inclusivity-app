import mongoose from "mongoose";
// Schema for support chat sessions between users and the AI assistant
const supportChatSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    messages: [
      {
        role: {
          type: String,
          enum: ["user", "assistant"],
          required: true,
        },
        content: {
          type: String,
          required: true,
        },
      },
    ],
    source: {
      type: String,
      enum: ["ai", "fallback"],
      default: "ai",
    },
  },
  { timestamps: true }
);

const SupportChat = mongoose.model("SupportChat", supportChatSchema);
export default SupportChat;