import axios from "axios";

export const getChatbotReply = async (message) => {
  try {
    const response = await axios.post(
            "https://router.huggingface.co/hf-inference/models/mistralai/Mistral-7B-Instruct-v0.2",

      
      
     {
        inputs: message,
        parameters: {
          max_new_tokens: 200,
          temperature: 0.7
        }
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.HF_TOKEN}`,
          "Content-Type": "application/json"
        }
      }
    );

    return response.data[0].generated_text;

  } catch (error) {
    console.error(error.response?.data || error.message);
    throw new Error("AI service unavailable");
  }
};


