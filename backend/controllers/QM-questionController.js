import * as questionService from "../services/QM-questionService.js";

// @desc    Add question to quiz
// @route   POST /api/quizzes/:quizId/questions
// @access  Private (Teacher)
export const addQuestion = async (req, res) => {
  try {
    const question = await questionService.addQuestion(
      req.params.quizId,
      req.user.id,
      req.body,
    );

    res.status(201).json({
      success: true,
      data: question,
      message: "Question added successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Add multiple questions
// @route   POST /api/quizzes/:quizId/questions/bulk
// @access  Private (Teacher)
export const addBulkQuestions = async (req, res) => {
  try {
    const questions = await questionService.addBulkQuestions(
      req.params.quizId,
      req.user.id,
      req.body.questions,
    );

    res.status(201).json({
      success: true,
      data: questions,
      message: `${questions.length} questions added successfully`,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all questions for a quiz
// @route   GET /api/quizzes/:quizId/questions
// @access  Private (Teacher)
export const getQuizQuestions = async (req, res) => {
  try {
    const questions = await questionService.getQuizQuestions(
      req.params.quizId,
      req.user.id,
    );

    res.status(200).json({
      success: true,
      data: questions,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update question
// @route   PUT /api/questions/:id
// @access  Private (Teacher)
export const updateQuestion = async (req, res) => {
  try {
    const question = await questionService.updateQuestion(
      req.params.id,
      req.user.id,
      req.body,
    );

    res.status(200).json({
      success: true,
      data: question,
      message: "Question updated successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete question
// @route   DELETE /api/questions/:id
// @access  Private (Teacher)
export const deleteQuestion = async (req, res) => {
  try {
    await questionService.deleteQuestion(req.params.id, req.user.id);

    res.status(200).json({
      success: true,
      message: "Question deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Reorder questions
// @route   PUT /api/quizzes/:quizId/questions/reorder
// @access  Private (Teacher)
export const reorderQuestions = async (req, res) => {
  try {
    const questions = await questionService.reorderQuestions(
      req.params.quizId,
      req.user.id,
      req.body.orders,
    );

    res.status(200).json({
      success: true,
      data: questions,
      message: "Questions reordered successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
