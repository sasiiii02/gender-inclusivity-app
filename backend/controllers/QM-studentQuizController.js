import * as studentQuizService from "../services/QM-studentQuizService.js";

// @desc    Join quiz
// @route   POST /api/student/quiz/join
// @access  Private (Student)
export const joinQuiz = async (req, res) => {
  try {
    const { quizLink, passcode } = req.body;

    const result = await studentQuizService.joinQuiz(
      quizLink,
      passcode,
      req.user.id,
      req.ip,
      req.headers["user-agent"],
    );

    res.status(200).json({
      success: true,
      data: result,
      message: result.isNew
        ? "Quiz joined successfully"
        : "Resuming previous attempt",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get quiz questions for student
// @route   GET /api/student/quiz/:studentQuizId/questions
// @access  Private (Student)
export const getStudentQuizQuestions = async (req, res) => {
  try {
    const result = await studentQuizService.getStudentQuizQuestions(
      req.params.studentQuizId,
      req.user.id,
    );

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Submit answer
// @route   POST /api/student/quiz/:studentQuizId/answer
// @access  Private (Student)
export const submitAnswer = async (req, res) => {
  try {
    const result = await studentQuizService.submitAnswer(
      req.params.studentQuizId,
      req.user.id,
      req.body,
    );

    res.status(200).json({
      success: true,
      data: result,
      message: "Answer submitted successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Complete quiz
// @route   POST /api/student/quiz/:studentQuizId/complete
// @access  Private (Student)
export const completeQuiz = async (req, res) => {
  try {
    const result = await studentQuizService.completeQuiz(
      req.params.studentQuizId,
      req.user.id,
    );

    res.status(200).json({
      success: true,
      data: result,
      message: "Quiz completed successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get student's quiz history
// @route   GET /api/student/quiz/history
// @access  Private (Student)
export const getQuizHistory = async (req, res) => {
  try {
    const result = await studentQuizService.getStudentQuizHistory(req.user.id);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get quiz result by ID
// @route   GET /api/student/quiz/:studentQuizId/result
// @access  Private (Student)
export const getQuizResult = async (req, res) => {
  try {
    const QMStudentQuiz = (await import("../models/QM-StudentQuiz.js")).default;

    const result = await QMStudentQuiz.findOne({
      _id: req.params.studentQuizId,
      studentId: req.user.id,
      status: "completed",
    }).populate("quizId", "title subject grade passMarks totalMarks");

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Result not found",
      });
    }

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
