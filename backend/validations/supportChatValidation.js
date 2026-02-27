export const validateChatMessage = (req, res, next) => {
  const { message } = req.body;

  if (!message || typeof message !== "string") {
    return res.status(400).json({
      success: false,
      message: "Message is required and must be a string",
    });
  }

  if (message.length < 2) {
    return res.status(400).json({
      success: false,
      message: "Message must be at least 2 characters long",
    });
  }

  next();
};