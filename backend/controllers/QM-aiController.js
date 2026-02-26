import * as aiService from "../services/QM-aiService.js";
import QMQuestion from "../models/QM-Question.js";
import QMStudentQuiz from "../models/QM-StudentQuiz.js";
import QMQuiz from "../models/QM-Quiz.js";
import QMAIExplanation from "../models/QM-AIExplanation.js";
import { checkRateLimit } from "../utils/QM-rateLimiter.js";

// @desc    Get AI explanation for a specific question
// @route   POST /api/ai/explain/:studentQuizId/:questionId
// @access  Private (Student)
export const getQuestionExplanation = async (req, res) => {
  try {
    const { studentQuizId, questionId } = req.params;
    const studentId = req.user.id;

    // Check rate limit (optional)
    if (!checkRateLimit(studentId)) {
      return res.status(429).json({
        success: false,
        message:
          "Too many requests. Please wait a moment before requesting more explanations.",
      });
    }

    // Check if explanation already exists in cache
    const cachedExplanation = await QMAIExplanation.findOne({
      studentQuizId,
      questionId,
    });

    if (cachedExplanation) {
      return res.status(200).json({
        success: true,
        data: {
          explanation: cachedExplanation.explanation,
          questionId,
          cached: true,
        },
      });
    }

    // Find the student's quiz attempt
    const studentQuiz = await QMStudentQuiz.findOne({
      _id: studentQuizId,
      studentId,
      status: "completed",
    }).populate("quizId");

    if (!studentQuiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz attempt not found or not completed",
      });
    }

    // Find the question
    const question = await QMQuestion.findOne({
      _id: questionId,
      quizId: studentQuiz.quizId._id,
      isDeleted: false,
    });

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });
    }

    // Find student's answer for this question
    const studentAnswerObj = studentQuiz.answers.find(
      (a) => a.questionId.toString() === questionId,
    );

    if (!studentAnswerObj) {
      return res.status(404).json({
        success: false,
        message: "Student didn't answer this question",
      });
    }

    // Get correct answer text
    const correctOption = question.options.find((opt) => opt.isCorrect);
    const correctAnswer = correctOption ? correctOption.text : "";

    // Get student's answer text
    const studentAnswer =
      studentAnswerObj.selectedOption ||
      (studentAnswerObj.selectedOptions || []).join(", ");

    // Generate explanation
    const result = await aiService.generateAnswerExplanation({
      questionText: question.questionText,
      studentAnswer,
      correctAnswer,
      options: question.options,
      questionType: question.questionType,
      isCorrect: studentAnswerObj.isCorrect,
    });

    console.log("📝 Explanation source:", result.source); // This will tell you!
    console.log(
      "📝 Explanation preview:",
      result.explanation.substring(0, 150),
    );

    // Cache the explanation
    if (result.success) {
      await QMAIExplanation.create({
        studentQuizId,
        questionId,
        explanation: result.explanation,
        studentId,
        quizId: studentQuiz.quizId._id,
        source: result.source, // Add this field to your schema
      });
    }

    res.status(200).json({
      success: true,
      data: {
        explanation: result.explanation,
        questionId,
        isCorrect: studentAnswerObj.isCorrect,
        studentAnswer,
        correctAnswer,
        cached: false,
      },
    });
  } catch (error) {
    console.error("Explanation error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Generate explanations for all questions in a quiz
// @route   POST /api/ai/explain-all/:studentQuizId
// @access  Private (Student)
export const getAllExplanations = async (req, res) => {
  try {
    const { studentQuizId } = req.params;
    const studentId = req.user.id;

    // Find student quiz
    const studentQuiz = await QMStudentQuiz.findOne({
      _id: studentQuizId,
      studentId,
      status: "completed",
    }).populate("quizId");

    if (!studentQuiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz attempt not found",
      });
    }

    // Check if explanations already exist
    const existingExplanations = await QMAIExplanation.find({
      studentQuizId,
    });

    if (existingExplanations.length === studentQuiz.answers.length) {
      // All explanations exist - return them
      return res.status(200).json({
        success: true,
        data: {
          explanations: existingExplanations,
          cached: true,
        },
      });
    }

    // Get all questions
    const questions = await QMQuestion.find({
      quizId: studentQuiz.quizId._id,
      isDeleted: false,
    });

    // Prepare data for bulk generation
    const questionsWithAnswers = studentQuiz.answers.map((answer) => {
      const question = questions.find(
        (q) => q._id.toString() === answer.questionId.toString(),
      );

      const correctOption = question.options.find((opt) => opt.isCorrect);

      return {
        questionText: question.questionText,
        studentAnswer:
          answer.selectedOption || answer.selectedOptions?.join(", "),
        correctAnswer: correctOption?.text,
        isCorrect: answer.isCorrect,
      };
    });

    // Generate explanations in bulk
    const explanations =
      await aiService.generateBulkExplanations(questionsWithAnswers);

    // Save explanations to cache
    const savedExplanations = [];
    for (let i = 0; i < studentQuiz.answers.length; i++) {
      const answer = studentQuiz.answers[i];
      const explanation = await QMAIExplanation.create({
        studentQuizId,
        questionId: answer.questionId,
        explanation: explanations[i] || "Explanation not available",
        studentId,
        quizId: studentQuiz.quizId._id,
      });
      savedExplanations.push(explanation);
    }

    res.status(200).json({
      success: true,
      data: {
        explanations: savedExplanations,
        cached: false,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all explanations for a quiz
// @route   GET /api/ai/explanations/:studentQuizId
// @access  Private (Student)
export const getQuizExplanations = async (req, res) => {
  try {
    const { studentQuizId } = req.params;
    const studentId = req.user.id;

    const explanations = await QMAIExplanation.find({
      studentQuizId,
      studentId,
    }).populate("questionId", "questionText options");

    res.status(200).json({
      success: true,
      data: explanations,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
