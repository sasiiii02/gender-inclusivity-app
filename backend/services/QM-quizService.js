import QMQuiz from "../models/QM-Quiz.js";
import QMQuestion from "../models/QM-Question.js";
import QMQuizSession from "../models/QM-QuizSession.js";
import QRCode from "qrcode";

// Create a new quiz
export const createQuiz = async (quizData, teacherId) => {
  try {
    const quiz = new QMQuiz({
      ...quizData,
      teacherId,
    });

    await quiz.save();

    // Generate QR code
    const baseUrl = process.env.FRONTEND_URL || "http://localhost:3000";
    const quizUrl = `${baseUrl}/quiz/join/${quiz.quizLink}`;

    try {
      const qrCodeData = await QRCode.toDataURL(quizUrl);
      quiz.qrCode = qrCodeData;
      await quiz.save();
    } catch (qrError) {
      console.error("QR Code generation failed:", qrError);
      // Continue even if QR generation fails
    }

    return quiz;
  } catch (error) {
    throw new Error(`Error creating quiz: ${error.message}`);
  }
};

// Get all quizzes for a teacher
export const getTeacherQuizzes = async (teacherId, query) => {
  try {
    const { status, page = 1, limit = 10, search } = query;
    const skip = (page - 1) * parseInt(limit);

    const filter = { teacherId, isDeleted: false };

    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { subject: { $regex: search, $options: "i" } },
        { grade: { $regex: search, $options: "i" } },
      ];
    }

    const quizzes = await QMQuiz.find(filter)
      .populate("teacherId", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await QMQuiz.countDocuments(filter);

    // Get question counts for each quiz
    const quizzesWithStats = await Promise.all(
      quizzes.map(async (quiz) => {
        const questionCount = await QMQuestion.countDocuments({
          quizId: quiz._id,
          isDeleted: false,
        });
        return {
          ...quiz.toObject(),
          questionCount,
        };
      }),
    );

    return {
      quizzes: quizzesWithStats,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
      },
    };
  } catch (error) {
    throw new Error(`Error fetching quizzes: ${error.message}`);
  }
};

// Get quiz by ID
export const getQuizById = async (quizId, teacherId = null) => {
  try {
    const filter = { _id: quizId, isDeleted: false };
    if (teacherId) filter.teacherId = teacherId;

    const quiz = await QMQuiz.findOne(filter).populate(
      "teacherId",
      "name email",
    );

    if (!quiz) {
      throw new Error("Quiz not found");
    }

    // Get questions
    const questions = await QMQuestion.find({ quizId, isDeleted: false }).sort({
      orderIndex: 1,
    });

    return {
      ...quiz.toObject(),
      questions,
    };
  } catch (error) {
    throw new Error(`Error fetching quiz: ${error.message}`);
  }
};

// Update quiz
export const updateQuiz = async (quizId, teacherId, updateData) => {
  try {
    const quiz = await QMQuiz.findOneAndUpdate(
      { _id: quizId, teacherId, isDeleted: false },
      updateData,
      { new: true, runValidators: true },
    );

    if (!quiz) {
      throw new Error("Quiz not found or you don't have permission");
    }

    return quiz;
  } catch (error) {
    throw new Error(`Error updating quiz: ${error.message}`);
  }
};

// Delete quiz (soft delete)
export const deleteQuiz = async (quizId, teacherId) => {
  try {
    const quiz = await QMQuiz.findOneAndUpdate(
      { _id: quizId, teacherId },
      { isDeleted: true },
      { new: true },
    );

    if (!quiz) {
      throw new Error("Quiz not found or you don't have permission");
    }

    // Also soft delete all questions
    await QMQuestion.updateMany({ quizId }, { isDeleted: true });

    return quiz;
  } catch (error) {
    throw new Error(`Error deleting quiz: ${error.message}`);
  }
};

// Publish quiz
export const publishQuiz = async (quizId, teacherId) => {
  try {
    // Check if quiz has questions
    const questionCount = await QMQuestion.countDocuments({
      quizId,
      isDeleted: false,
    });

    if (questionCount === 0) {
      throw new Error("Cannot publish quiz with no questions");
    }

    // Calculate total marks
    const questions = await QMQuestion.find({ quizId, isDeleted: false });
    const totalMarks = questions.reduce((sum, q) => sum + q.marks, 0);

    const quiz = await QMQuiz.findOneAndUpdate(
      { _id: quizId, teacherId, isDeleted: false },
      {
        status: "published",
        totalMarks,
        totalQuestions: questionCount,
      },
      { new: true },
    );

    if (!quiz) {
      throw new Error("Quiz not found or you don't have permission");
    }

    return quiz;
  } catch (error) {
    throw new Error(`Error publishing quiz: ${error.message}`);
  }
};

// Start quiz session
export const startQuizSession = async (quizId, teacherId) => {
  try {
    const quiz = await QMQuiz.findOne({
      _id: quizId,
      teacherId,
      isDeleted: false,
    });

    if (!quiz) {
      throw new Error("Quiz not found or you don't have permission");
    }

    if (quiz.status !== "published") {
      throw new Error("Quiz must be published before starting");
    }

    // Create or update session
    let session = await QMQuizSession.findOne({
      quizId,
      status: { $in: ["waiting", "active"] },
    });

    if (!session) {
      session = new QMQuizSession({
        quizId,
        teacherId,
        status: "active",
        startedAt: new Date(),
      });
    } else {
      session.status = "active";
      session.startedAt = new Date();
    }

    await session.save();

    // Update quiz status
    quiz.status = "active";
    quiz.startTime = new Date();
    quiz.endTime = new Date(Date.now() + quiz.duration * 60000);
    await quiz.save();

    return { quiz, session };
  } catch (error) {
    throw new Error(`Error starting quiz: ${error.message}`);
  }
};

// End quiz session
export const endQuizSession = async (quizId, teacherId) => {
  try {
    const session = await QMQuizSession.findOne({ quizId, status: "active" });

    if (!session) {
      throw new Error("No active session found");
    }

    session.status = "ended";
    session.endedAt = new Date();
    await session.save();

    // Update quiz status
    await QMQuiz.findByIdAndUpdate(quizId, { status: "completed" });

    return session;
  } catch (error) {
    throw new Error(`Error ending quiz: ${error.message}`);
  }
};

// Get live quiz stats for teacher
export const getLiveQuizStats = async (quizId, teacherId) => {
  try {
    const session = await QMQuizSession.findOne({
      quizId,
      status: "active",
    }).populate("activeStudents.studentId", "name email");

    if (!session) {
      throw new Error("No active session found");
    }

    // Verify teacher owns this quiz
    const quiz = await QMQuiz.findOne({ _id: quizId, teacherId });
    if (!quiz) {
      throw new Error("Unauthorized");
    }

    return session;
  } catch (error) {
    throw new Error(`Error fetching live stats: ${error.message}`);
  }
};

// Get quiz results summary
export const getQuizResults = async (quizId, teacherId) => {
  try {
    const quiz = await QMQuiz.findOne({ _id: quizId, teacherId });

    if (!quiz) {
      throw new Error("Quiz not found");
    }

    const QMStudentQuiz = (await import("../models/QM-StudentQuiz.js")).default;

    const results = await QMStudentQuiz.find({ quizId, status: "completed" })
      .populate("studentId", "name email")
      .sort({ percentage: -1 });

    const summary = {
      totalAttempts: results.length,
      passedCount: results.filter((r) => r.isPassed).length,
      failedCount: results.filter((r) => !r.isPassed).length,
      averageScore:
        results.reduce((sum, r) => sum + r.percentage, 0) /
        (results.length || 1),
      highestScore:
        results.length > 0 ? Math.max(...results.map((r) => r.percentage)) : 0,
      lowestScore:
        results.length > 0 ? Math.min(...results.map((r) => r.percentage)) : 0,
      results,
    };

    return summary;
  } catch (error) {
    throw new Error(`Error fetching results: ${error.message}`);
  }
};
