// Create a new quiz
export const createQuiz = async (quizData, teacherId) => {
  try {
    const quiz = new QMQuiz({
      ...quizData,
      teacherId,
    });

    // Save first to generate _id and quizLink
    await quiz.save();

    // Generate QR code after quiz is saved
    const baseUrl = process.env.FRONTEND_URL || "http://localhost:3000";
    const quizUrl = `${baseUrl}/quiz/join/${quiz.quizLink}`;

    try {
      const qrCodeData = await QRCode.toDataURL(quizUrl);
      quiz.qrCode = qrCodeData;
      await quiz.save(); // Second save is fine here
    } catch (qrError) {
      console.error("QR Code generation failed:", qrError);
      // Continue even if QR generation fails
    }

    return quiz;
  } catch (error) {
    throw new Error(`Error creating quiz qr generator: ${error.message}`);
  }
};
