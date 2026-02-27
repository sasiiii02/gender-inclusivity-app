import { getChatbotReply } from "../services/chatService.js";

export const chatWithBot = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ message: "Message is required" });
    }

    const reply = await getChatbotReply(message);

    res.status(200).json({ reply });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};