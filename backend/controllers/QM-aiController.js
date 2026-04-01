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

    console.log(
      `🔍 Getting explanation for question ${questionId} in quiz ${studentQuizId}`,
    );

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
      console.log("📦 Found cached explanation");
      return res.status(200).json({
        success: true,
        data: {
          explanation: cachedExplanation.explanation,
          questionId,
          cached: true,
          source: cachedExplanation.source,
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

    console.log("📝 Generating new explanation...");
    console.log("   Question:", question.questionText.substring(0, 50) + "...");
    console.log("   Student answer:", studentAnswer);
    console.log("   Correct answer:", correctAnswer);
    console.log("   Is correct:", studentAnswerObj.isCorrect);

    // Generate explanation
    const result = await aiService.generateAnswerExplanation({
      questionText: question.questionText,
      studentAnswer,
      correctAnswer,
      options: question.options,
      questionType: question.questionType,
      isCorrect: studentAnswerObj.isCorrect,
    });

    console.log("📝 Explanation source:", result.source);
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
        source: result.source,
      });
      console.log("💾 Explanation cached to database");
    }

    res.status(200).json({
      success: true,
      data: {
        explanation: result.explanation,
        questionId,
        isCorrect: studentAnswerObj.isCorrect,
        studentAnswer,
        correctAnswer,
        source: result.source,
        cached: false,
      },
    });
  } catch (error) {
    console.error("❌ Explanation error:", error);
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

    console.log(
      `🔍 Generating all explanations for quiz attempt: ${studentQuizId}`,
    );

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

    console.log(`📊 Quiz has ${studentQuiz.answers.length} answered questions`);

    // Check if explanations already exist
    const existingExplanations = await QMAIExplanation.find({
      studentQuizId,
    });

    if (existingExplanations.length === studentQuiz.answers.length) {
      console.log("📦 All explanations already exist in cache");
      return res.status(200).json({
        success: true,
        data: {
          explanations: existingExplanations,
          cached: true,
        },
      });
    }

    console.log(
      `🆕 Generating ${studentQuiz.answers.length} new explanations...`,
    );

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

    console.log(`✅ Received ${explanations.length} explanations`);

    // Save explanations to cache
    const savedExplanations = [];
    for (let i = 0; i < studentQuiz.answers.length; i++) {
      const answer = studentQuiz.answers[i];

      // Check if explanation already exists for this question (avoid duplicates)
      const existing = await QMAIExplanation.findOne({
        studentQuizId,
        questionId: answer.questionId,
      });

      if (existing) {
        savedExplanations.push(existing);
        continue;
      }

      const explanation = await QMAIExplanation.create({
        studentQuizId,
        questionId: answer.questionId,
        explanation: explanations[i] || "Explanation not available",
        studentId,
        quizId: studentQuiz.quizId._id,
        source:
          explanations[i]?.includes("Great job") ||
          explanations[i]?.includes("The correct answer")
            ? "fallback"
            : "ai",
      });
      savedExplanations.push(explanation);
    }

    console.log(
      `✅ Saved ${savedExplanations.length} explanations to database`,
    );

    res.status(200).json({
      success: true,
      data: {
        explanations: savedExplanations,
        cached: false,
      },
    });
  } catch (error) {
    console.error("❌ Error in getAllExplanations:", error);
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

    console.log(`🔍 Fetching all explanations for quiz: ${studentQuizId}`);

    const explanations = await QMAIExplanation.find({
      studentQuizId,
      studentId,
    }).populate("questionId", "questionText options");

    console.log(`📦 Found ${explanations.length} explanations`);

    res.status(200).json({
      success: true,
      data: explanations,
    });
  } catch (error) {
    console.error("❌ Error fetching explanations:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Provide feedback on explanation helpfulness
// @route   POST /api/ai/feedback/:explanationId
// @access  Private (Student)
export const provideExplanationFeedback = async (req, res) => {
  try {
    const { explanationId } = req.params;
    const { helpful } = req.body;
    const studentId = req.user.id;

    const explanation = await QMAIExplanation.findOne({
      _id: explanationId,
      studentId,
    });

    if (!explanation) {
      return res.status(404).json({
        success: false,
        message: "Explanation not found",
      });
    }

    explanation.feedback.helpful = helpful;
    explanation.feedback.reportedAt = new Date();
    await explanation.save();

    console.log(
      `📝 Feedback recorded for explanation ${explanationId}: ${helpful ? "helpful" : "not helpful"}`,
    );

    res.status(200).json({
      success: true,
      message: "Feedback recorded successfully",
    });
  } catch (error) {
    console.error("❌ Error recording feedback:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
