import QRCode from "qrcode";

export const generateQuizQRCode = async (quizLink) => {
  try {
    const baseUrl = process.env.FRONTEND_URL || "http://localhost:3000";
    const quizUrl = `${baseUrl}/quiz/join/${quizLink}`;

    const qrCodeDataUrl = await QRCode.toDataURL(quizUrl, {
      width: 300,
      margin: 2,
      color: {
        dark: "#000000",
        light: "#ffffff",
      },
    });

    return qrCodeDataUrl;
  } catch (error) {
    throw new Error(`QR Code generation failed: ${error.message}`);
  }
};

export const generateQuizLink = (quizId) => {
  const randomStr = Math.random().toString(36).substring(2, 10);
  return `quiz-${quizId}-${randomStr}`;
};
