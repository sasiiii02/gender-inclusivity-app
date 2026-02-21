import QMQuestion from "../models/QM-Question.js";
import QMQuiz from "../models/QM-Quiz.js";

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

    const question = new QMQuestion({
      ...questionData,
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

    const questions = questionsData.map((q) => ({
      ...q,
      quizId,
    }));

    const insertedQuestions = await QMQuestion.insertMany(questions);

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
        qObj.options = qObj.options.map((opt) => ({ text: opt.text })); // Remove isCorrect
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
