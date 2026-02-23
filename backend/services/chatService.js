import axios from "axios";

export const getChatbotReply = async (message) => {
  try {
    const response = await axios.post(
      "https://api-inference.huggingface.co/models/facebook/blenderbot-small-90M",
      
      {
        inputs: message,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
        },
      }
    );

    return response.data[0].generated_text;

  } catch (error) {
    console.error(error.response?.data || error.message);
    throw new Error("AI service unavailable");
  }
};