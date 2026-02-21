import QMQuiz from "../models/QM-Quiz.js";
import QMQuestion from "../models/QM-Question.js";
import QMStudentQuiz from "../models/QM-StudentQuiz.js";
import QMQuizSession from "../models/QM-QuizSession.js";

// Join quiz (student)
export const joinQuiz = async (
  quizLink,
  passcode,
  studentId,
  ipAddress,
  deviceInfo,
) => {
  try {
    // Find quiz
    const quiz = await QMQuiz.findOne({
      quizLink,
      passcode,
      isDeleted: false,
      status: { $in: ["published", "active"] },
    });

    if (!quiz) {
      throw new Error("Invalid quiz link or passcode");
    }

    // Check if quiz is active or published
    if (quiz.status === "published") {
      throw new Error("Quiz hasn't started yet");
    }

    // Check if student has exceeded max attempts
    const attempts = await QMStudentQuiz.countDocuments({
      quizId: quiz._id,
      studentId,
      status: "completed",
    });

    if (attempts >= quiz.settings.maxAttempts) {
      throw new Error(
        `You have exceeded maximum attempts (${quiz.settings.maxAttempts})`,
      );
    }

    // Check for existing in-progress attempt
    const existingAttempt = await QMStudentQuiz.findOne({
      quizId: quiz._id,
      studentId,
      status: "in-progress",
    });

    if (existingAttempt) {
      // Return existing attempt
      return {
        studentQuiz: existingAttempt,
        quiz,
        isNew: false,
      };
    }

    // Create new student quiz
    const attemptNumber = attempts + 1;

    const studentQuiz = new QMStudentQuiz({
      quizId: quiz._id,
      studentId,
      attemptNumber,
      timeRemaining: quiz.duration * 60, // Convert to seconds
      ipAddress,
      deviceInfo,
    });

    await studentQuiz.save();

    // Update session attendance
    await updateSessionAttendance(quiz._id, studentId);

    return {
      studentQuiz,
      quiz,
      isNew: true,
    };
  } catch (error) {
    throw new Error(`Error joining quiz: ${error.message}`);
  }
};

// Get quiz questions for student
export const getStudentQuizQuestions = async (studentQuizId, studentId) => {
  try {
    const studentQuiz = await QMStudentQuiz.findOne({
      _id: studentQuizId,
      studentId,
      status: "in-progress",
    });

    if (!studentQuiz) {
      throw new Error("Quiz not found or not in progress");
    }

    const quiz = await QMQuiz.findById(studentQuiz.quizId);

    if (!quiz) {
      throw new Error("Quiz not found");
    }

    // Get questions without correct answers
    let questions = await QMQuestion.find({
      quizId: studentQuiz.quizId,
      isDeleted: false,
    }).sort({ orderIndex: 1 });

    // Shuffle if enabled
    if (quiz.settings.shuffleQuestions) {
      questions = shuffleArray(questions);
    }

    // Remove correct answer info
    questions = questions.map((q) => {
      const qObj = q.toObject();
      delete qObj.correctAnswer;
      qObj.options = qObj.options.map((opt) => ({ text: opt.text }));
      return qObj;
    });

    // Get already answered questions
    const answeredQuestionIds = studentQuiz.answers.map((a) =>
      a.questionId.toString(),
    );

    return {
      questions,
      answeredQuestionIds,
      timeRemaining: studentQuiz.timeRemaining,
      totalQuestions: questions.length,
      answeredCount: answeredQuestionIds.length,
      quizTitle: quiz.title,
      duration: quiz.duration,
    };
  } catch (error) {
    throw new Error(`Error fetching questions: ${error.message}`);
  }
};

// Submit answer
export const submitAnswer = async (studentQuizId, studentId, answerData) => {
  try {
    const studentQuiz = await QMStudentQuiz.findOne({
      _id: studentQuizId,
      studentId,
      status: "in-progress",
    }).populate("quizId");

    if (!studentQuiz) {
      throw new Error("Quiz not found or not in progress");
    }

    // Check if time expired
    if (studentQuiz.timeRemaining <= 0) {
      studentQuiz.status = "timed-out";
      await studentQuiz.save();
      throw new Error("Quiz time expired");
    }

    const { questionId, selectedOption, selectedOptions, timeSpent } =
      answerData;

    // Get question details
    const question = await QMQuestion.findOne({
      _id: questionId,
      quizId: studentQuiz.quizId._id,
      isDeleted: false,
    });

    if (!question) {
      throw new Error("Question not found");
    }

    // Check if already answered
    const existingAnswerIndex = studentQuiz.answers.findIndex(
      (a) => a.questionId.toString() === questionId,
    );

    // Calculate if answer is correct
    let isCorrect = false;
    let marksObtained = 0;

    if (
      question.questionType === "mcq" ||
      question.questionType === "true-false"
    ) {
      const correctOption = question.options.find((opt) => opt.isCorrect);
      isCorrect = correctOption && correctOption.text === selectedOption;
      marksObtained = isCorrect ? question.marks : -question.negativeMarks;
    } else if (question.questionType === "multiple-answer") {
      const correctOptions = question.options
        .filter((opt) => opt.isCorrect)
        .map((opt) => opt.text);
      const selectedSet = new Set(selectedOptions || []);
      const correctSet = new Set(correctOptions);

      // Check if all correct options are selected and no wrong options
      const allCorrectSelected = correctOptions.every((opt) =>
        selectedSet.has(opt),
      );
      const noWrongSelected = selectedOptions.every((opt) =>
        correctSet.has(opt),
      );

      isCorrect = allCorrectSelected && noWrongSelected;
      marksObtained = isCorrect ? question.marks : -question.negativeMarks;
    }

    const answer = {
      questionId,
      selectedOption: selectedOption || null,
      selectedOptions: selectedOptions || [],
      isCorrect,
      marksObtained: Math.max(marksObtained, 0), // Don't go below 0
      timeSpent: timeSpent || 0,
      answeredAt: new Date(),
    };

    if (existingAnswerIndex >= 0) {
      // Update existing answer
      studentQuiz.answers[existingAnswerIndex] = answer;
    } else {
      // Add new answer
      studentQuiz.answers.push(answer);
    }

    // Update last active
    studentQuiz.lastActiveAt = new Date();

    // Recalculate total marks
    studentQuiz.totalMarksObtained = studentQuiz.answers.reduce(
      (sum, a) => sum + (a.marksObtained || 0),
      0,
    );
    studentQuiz.totalMarksPossible = studentQuiz.quizId.totalMarks;

    await studentQuiz.save();

    return {
      isCorrect,
      marksObtained,
      explanation: question.explanation,
      nextQuestion: await getNextQuestion(studentQuiz, questionId),
    };
  } catch (error) {
    throw new Error(`Error submitting answer: ${error.message}`);
  }
};

// Complete quiz
export const completeQuiz = async (studentQuizId, studentId) => {
  try {
    const studentQuiz = await QMStudentQuiz.findOne({
      _id: studentQuizId,
      studentId,
      status: "in-progress",
    }).populate("quizId");

    if (!studentQuiz) {
      throw new Error("Quiz not found or already completed");
    }

    // Get quiz pass marks
    const passMarks = studentQuiz.quizId.passMarks;

    // Calculate final results
    studentQuiz.status = "completed";
    studentQuiz.completedAt = new Date();
    studentQuiz.isPassed = studentQuiz.totalMarksObtained >= passMarks;

    await studentQuiz.save();

    // Update session completed count
    await QMQuizSession.findOneAndUpdate(
      { quizId: studentQuiz.quizId._id, status: "active" },
      { $inc: { completedCount: 1 } },
    );

    // Update quiz statistics
    await updateQuizStatistics(studentQuiz.quizId._id);

    return {
      totalMarksObtained: studentQuiz.totalMarksObtained,
      totalMarksPossible: studentQuiz.totalMarksPossible,
      percentage: studentQuiz.percentage,
      isPassed: studentQuiz.isPassed,
      passMarks,
    };
  } catch (error) {
    throw new Error(`Error completing quiz: ${error.message}`);
  }
};

// Get student's quiz history
export const getStudentQuizHistory = async (studentId) => {
  try {
    const history = await QMStudentQuiz.find({
      studentId,
      status: "completed",
    })
      .populate("quizId", "title subject grade totalMarks passMarks")
      .sort({ completedAt: -1 });

    const stats = {
      totalQuizzesTaken: history.length,
      averageScore:
        history.reduce((sum, h) => sum + h.percentage, 0) /
        (history.length || 1),
      passedCount: history.filter((h) => h.isPassed).length,
      failedCount: history.filter((h) => !h.isPassed).length,
    };

    return { history, stats };
  } catch (error) {
    throw new Error(`Error fetching history: ${error.message}`);
  }
};

// Helper function to update session attendance
const updateSessionAttendance = async (quizId, studentId) => {
  try {
    const session = await QMQuizSession.findOne({ quizId, status: "active" });

    if (session) {
      // Check if student already in session
      const existingStudent = session.activeStudents.find(
        (s) => s.studentId.toString() === studentId.toString(),
      );

      if (!existingStudent) {
        session.activeStudents.push({
          studentId,
          joinedAt: new Date(),
        });
        session.totalAttendance += 1;
        await session.save();
      } else {
        existingStudent.lastActiveAt = new Date();
        await session.save();
      }
    }
  } catch (error) {
    console.error("Error updating session attendance:", error);
  }
};

// Helper function to get next question
const getNextQuestion = async (studentQuiz, currentQuestionId) => {
  const allQuestions = await QMQuestion.find({
    quizId: studentQuiz.quizId._id,
    isDeleted: false,
  }).sort({ orderIndex: 1 });

  const answeredIds = studentQuiz.answers.map((a) => a.questionId.toString());
  const remainingQuestions = allQuestions.filter(
    (q) => !answeredIds.includes(q._id.toString()),
  );

  if (remainingQuestions.length > 0) {
    return remainingQuestions[0]._id;
  }
  return null;
};

// Helper function to update quiz statistics
const updateQuizStatistics = async (quizId) => {
  try {
    const completedQuizzes = await QMStudentQuiz.find({
      quizId,
      status: "completed",
    });

    if (completedQuizzes.length === 0) return;

    const scores = completedQuizzes.map((q) => q.percentage);
    const passedCount = completedQuizzes.filter((q) => q.isPassed).length;

    const statistics = {
      averageScore: scores.reduce((a, b) => a + b, 0) / scores.length,
      highestScore: Math.max(...scores),
      lowestScore: Math.min(...scores),
      totalAttempts: completedQuizzes.length,
      passRate: (passedCount / completedQuizzes.length) * 100,
    };

    await QMQuiz.findByIdAndUpdate(quizId, { statistics });
  } catch (error) {
    console.error("Error updating quiz statistics:", error);
  }
};

// Helper function to shuffle array
const shuffleArray = (array) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};
