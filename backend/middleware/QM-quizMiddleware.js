import QMQuiz from "../models/QM-Quiz.js";

// Middleware to check if quiz exists and user has access
export const checkQuizAccess = async (req, res, next) => {
  try {
    const quiz = await QMQuiz.findOne({
      _id: req.params.quizId || req.params.id,
      isDeleted: false,
    });

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found",
      });
    }

    req.quiz = quiz;
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Middleware to check if teacher owns the quiz
export const checkQuizOwnership = async (req, res, next) => {
  try {
    if (
      req.quiz.teacherId.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to modify this quiz",
      });
    }
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
