import SupportChat from "../models/SupportChat.js";
import { generateChatReply } from "../services/supportAiService.js";
// Controller for handling support chat interactions between users and the AI assistant
export const sendChatMessage = async (req, res) => {
  try {
    const userId = req.user.id;
    const { message } = req.body;

    let chat = await SupportChat.findOne({ userId });

    if (!chat) {
      chat = await SupportChat.create({
        userId,
        messages: [],
      });
    }

    chat.messages.push({
      role: "user",
      content: message,
    });

    const aiResult = await generateChatReply(chat.messages);

    chat.messages.push({
      role: "assistant",
      content: aiResult.reply,
    });

    chat.source = aiResult.source;
    await chat.save();

    res.status(200).json({
      success: true,
      data: {
        reply: aiResult.reply,
        source: aiResult.source,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};