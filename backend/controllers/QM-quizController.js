import * as quizService from "../services/QM-quizService.js";

// @desc    Create a new quiz
// @route   POST /api/quizzes
// @access  Private (Teacher)
export const createQuiz = async (req, res) => {
  try {
    const quiz = await quizService.createQuiz(req.body, req.user.id);

    res.status(201).json({
      success: true,
      data: quiz,
      message: "Quiz created successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all quizzes for teacher
// @route   GET /api/quizzes
// @access  Private (Teacher)
export const getQuizzes = async (req, res) => {
  try {
    const result = await quizService.getTeacherQuizzes(req.user.id, req.query);

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

// @desc    Get single quiz by ID
// @route   GET /api/quizzes/:id
// @access  Private (Teacher)
export const getQuizById = async (req, res) => {
  try {
    const quiz = await quizService.getQuizById(req.params.id, req.user.id);

    res.status(200).json({
      success: true,
      data: quiz,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update quiz
// @route   PUT /api/quizzes/:id
// @access  Private (Teacher)
export const updateQuiz = async (req, res) => {
  try {
    const quiz = await quizService.updateQuiz(
      req.params.id,
      req.user.id,
      req.body,
    );

    res.status(200).json({
      success: true,
      data: quiz,
      message: "Quiz updated successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete quiz
// @route   DELETE /api/quizzes/:id
// @access  Private (Teacher)
export const deleteQuiz = async (req, res) => {
  try {
    await quizService.deleteQuiz(req.params.id, req.user.id);

    res.status(200).json({
      success: true,
      message: "Quiz deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Publish quiz
// @route   PUT /api/quizzes/:id/publish
// @access  Private (Teacher)
export const publishQuiz = async (req, res) => {
  try {
    const quiz = await quizService.publishQuiz(req.params.id, req.user.id);

    res.status(200).json({
      success: true,
      data: quiz,
      message: "Quiz published successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Start quiz session
// @route   POST /api/quizzes/:id/start
// @access  Private (Teacher)
export const startQuiz = async (req, res) => {
  try {
    const result = await quizService.startQuizSession(
      req.params.id,
      req.user.id,
    );

    res.status(200).json({
      success: true,
      data: result,
      message: "Quiz started successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    End quiz session
// @route   POST /api/quizzes/:id/end
// @access  Private (Teacher)
export const endQuiz = async (req, res) => {
  try {
    const session = await quizService.endQuizSession(
      req.params.id,
      req.user.id,
    );

    res.status(200).json({
      success: true,
      data: session,
      message: "Quiz ended successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get live quiz stats
// @route   GET /api/quizzes/:id/live
// @access  Private (Teacher)
export const getLiveStats = async (req, res) => {
  try {
    const stats = await quizService.getLiveQuizStats(
      req.params.id,
      req.user.id,
    );

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get quiz results
// @route   GET /api/quizzes/:id/results
// @access  Private (Teacher)
export const getQuizResults = async (req, res) => {
  try {
    const results = await quizService.getQuizResults(
      req.params.id,
      req.user.id,
    );

    res.status(200).json({
      success: true,
      data: results,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
