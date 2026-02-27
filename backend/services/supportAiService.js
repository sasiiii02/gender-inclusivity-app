import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const getModel = () => {
  return genAI.getGenerativeModel({
    model: process.env.GEMINI_MODEL || "gemini-1.5-flash",
    generationConfig: {
      temperature: Number(process.env.GEMINI_TEMPERATURE || 0.6),
      maxOutputTokens: Number(process.env.GEMINI_MAX_TOKENS || 1000),
    },
  });
};
//Generate AI chat reply for support conversations
export const generateChatReply = async (conversation) => {
  try {
    const model = getModel();

    const systemPrompt = `
You are a professional support assistant for a school gender inclusivity platform.
Help students with:
- Incident reporting
- Checking report status
- Understanding support resources
- Emotional reassurance (be respectful and calm)

Keep responses concise and supportive.
`;

    const formattedConversation = conversation
      .map((msg) => `${msg.role.toUpperCase()}: ${msg.content}`)
      .join("\n");

    const prompt = `${systemPrompt}\n\n${formattedConversation}\nASSISTANT:`;

    const result = await model.generateContent(prompt);
    const response = result.response.text();

    return {
      success: true,
      reply: response,
      source: "ai",
    };
  } catch (error) {
    return {
      success: false,
      reply:
        "I'm here to help. Please try again later or contact a counselor if this is urgent.",
      source: "fallback",
    };
  }
};