import QMQuestion from "../models/QM-Question.js";
import QMQuiz from "../models/QM-Quiz.js";

// Helper function to set correctAnswer from options
const setCorrectAnswerFromOptions = (questionData) => {
  if (questionData.options && questionData.options.length > 0) {
    const correctOption = questionData.options.find((opt) => opt.isCorrect);
    if (correctOption) {
      questionData.correctAnswer = correctOption.text;
    }
  }
  return questionData;
};

// Helper function to validate that at least one option is correct
const validateCorrectOption = (options, questionType) => {
  if (questionType === "mcq" || questionType === "true-false") {
    const hasCorrectOption = options.some((opt) => opt.isCorrect === true);
    if (!hasCorrectOption) {
      throw new Error("At least one option must be marked as correct");
    }
  } else if (questionType === "multiple-answer") {
    const correctCount = options.filter((opt) => opt.isCorrect === true).length;
    if (correctCount < 1) {
      throw new Error("At least one option must be marked as correct");
    }
  }
};

// Helper function to validate true-false questions
const validateTrueFalseQuestion = (options) => {
  if (options.length !== 2) {
    throw new Error("True/False questions must have exactly 2 options");
  }

  const texts = options.map((opt) => opt.text.toLowerCase());
  const hasTrue = texts.includes("true");
  const hasFalse = texts.includes("false");

  if (!hasTrue || !hasFalse) {
    throw new Error(
      "True/False questions must have 'True' and 'False' as options",
    );
  }
};

// Add question to quiz
export const addQuestion = async (quizId, teacherId, questionData) => {
  try {
    // Verify quiz ownership
    const quiz = await QMQuiz.findOne({
      _id: quizId,
      teacherId,
      isDeleted: false,
    });

    if (!quiz) {
      throw new Error("Quiz not found or you don't have permission");
    }

    // Validate based on question type
    if (questionData.questionType === "true-false") {
      validateTrueFalseQuestion(questionData.options);
    }

    // Validate that at least one option is correct
    validateCorrectOption(questionData.options, questionData.questionType);

    // Set correctAnswer from options
    const processedData = setCorrectAnswerFromOptions({ ...questionData });

    const question = new QMQuestion({
      ...processedData,
      quizId,
    });

    await question.save();

    // Update quiz total marks
    await updateQuizTotalMarks(quizId);

    return question;
  } catch (error) {
    throw new Error(`Error adding question: ${error.message}`);
  }
};

// Add multiple questions
export const addBulkQuestions = async (quizId, teacherId, questionsData) => {
  try {
    // Verify quiz ownership
    const quiz = await QMQuiz.findOne({
      _id: quizId,
      teacherId,
      isDeleted: false,
    });

    if (!quiz) {
      throw new Error("Quiz not found or you don't have permission");
    }

    // Process each question
    const processedQuestions = questionsData.map((q) => {
      // Validate based on question type
      if (q.questionType === "true-false") {
        validateTrueFalseQuestion(q.options);
      }

      // Validate that at least one option is correct
      validateCorrectOption(q.options, q.questionType);

      // Set correctAnswer from options
      return setCorrectAnswerFromOptions({
        ...q,
        quizId,
      });
    });

    const insertedQuestions = await QMQuestion.insertMany(processedQuestions);

    // Update quiz total marks
    await updateQuizTotalMarks(quizId);

    return insertedQuestions;
  } catch (error) {
    throw new Error(`Error adding bulk questions: ${error.message}`);
  }
};

// Get all questions for a quiz
export const getQuizQuestions = async (quizId, teacherId = null) => {
  try {
    const filter = { quizId, isDeleted: false };

    // If teacherId provided, verify ownership
    if (teacherId) {
      const quiz = await QMQuiz.findOne({ _id: quizId, teacherId });
      if (!quiz) {
        throw new Error("Unauthorized");
      }
    }

    const questions = await QMQuestion.find(filter).sort({ orderIndex: 1 });

    // Don't send correct answers if it's for students
    if (!teacherId) {
      return questions.map((q) => {
        const qObj = q.toObject();
        delete qObj.correctAnswer;
        qObj.options = qObj.options.map((opt) => ({
          text: opt.text,
          // Remove isCorrect for students
        }));
        return qObj;
      });
    }

    return questions;
  } catch (error) {
    throw new Error(`Error fetching questions: ${error.message}`);
  }
};

// Update question
export const updateQuestion = async (questionId, teacherId, updateData) => {
  try {
    const question = await QMQuestion.findById(questionId).populate("quizId");

    if (!question || question.isDeleted) {
      throw new Error("Question not found");
    }

    // Verify quiz ownership
    const quiz = await QMQuiz.findOne({ _id: question.quizId._id, teacherId });
    if (!quiz) {
      throw new Error("Unauthorized");
    }

    // If options are being updated, validate them
    if (updateData.options) {
      const questionType = updateData.questionType || question.questionType;

      if (questionType === "true-false") {
        validateTrueFalseQuestion(updateData.options);
      }

      validateCorrectOption(updateData.options, questionType);

      // Update correctAnswer based on new options
      updateData = setCorrectAnswerFromOptions(updateData);
    }

    const updatedQuestion = await QMQuestion.findByIdAndUpdate(
      questionId,
      updateData,
      { new: true, runValidators: true },
    );

    // Update quiz total marks
    await updateQuizTotalMarks(question.quizId._id);

    return updatedQuestion;
  } catch (error) {
    throw new Error(`Error updating question: ${error.message}`);
  }
};

// Delete question
export const deleteQuestion = async (questionId, teacherId) => {
  try {
    const question = await QMQuestion.findById(questionId).populate("quizId");

    if (!question || question.isDeleted) {
      throw new Error("Question not found");
    }

    // Verify quiz ownership
    const quiz = await QMQuiz.findOne({ _id: question.quizId._id, teacherId });
    if (!quiz) {
      throw new Error("Unauthorized");
    }

    question.isDeleted = true;
    await question.save();

    // Update quiz total marks
    await updateQuizTotalMarks(question.quizId._id);

    return question;
  } catch (error) {
    throw new Error(`Error deleting question: ${error.message}`);
  }
};

// Reorder questions
export const reorderQuestions = async (quizId, teacherId, questionOrders) => {
  try {
    // Verify quiz ownership
    const quiz = await QMQuiz.findOne({ _id: quizId, teacherId });
    if (!quiz) {
      throw new Error("Unauthorized");
    }

    const bulkOps = questionOrders.map(({ questionId, orderIndex }) => ({
      updateOne: {
        filter: { _id: questionId, quizId },
        update: { $set: { orderIndex } },
      },
    }));

    await QMQuestion.bulkWrite(bulkOps);

    return await QMQuestion.find({ quizId, isDeleted: false }).sort({
      orderIndex: 1,
    });
  } catch (error) {
    throw new Error(`Error reordering questions: ${error.message}`);
  }
};

// Helper function to update quiz total marks
const updateQuizTotalMarks = async (quizId) => {
  try {
    const questions = await QMQuestion.find({ quizId, isDeleted: false });
    const totalMarks = questions.reduce((sum, q) => sum + q.marks, 0);
    const totalQuestions = questions.length;

    await QMQuiz.findByIdAndUpdate(quizId, { totalMarks, totalQuestions });
  } catch (error) {
    console.error("Error updating quiz total marks:", error);
  }
};

// New helper function to validate question data
export const validateQuestionData = (questionData) => {
  const errors = [];

  // Check if options exist
  if (!questionData.options || questionData.options.length < 2) {
    errors.push("At least 2 options are required");
  }

  // Check for correct option
  const hasCorrectOption = questionData.options?.some(
    (opt) => opt.isCorrect === true,
  );
  if (!hasCorrectOption) {
    errors.push("At least one option must be marked as correct");
  }

  // For true-false, validate specific format
  if (questionData.questionType === "true-false") {
    if (questionData.options?.length !== 2) {
      errors.push("True/False questions must have exactly 2 options");
    } else {
      const texts = questionData.options.map((opt) => opt.text.toLowerCase());
      if (!texts.includes("true") || !texts.includes("false")) {
        errors.push(
          "True/False questions must have 'True' and 'False' as options",
        );
      }
    }
  }

  return errors;
};
