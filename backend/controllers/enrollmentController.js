import * as enrollmentService from "../services/enrollmentService.js";
import {
  sendEnrollmentEmail,
  sendCompletionEmail,
} from "../services/brevoEmailService.js";

// @desc    Enroll using JSON body { courseId } — POST /api/enrollments
// @access  Private (Student)
export const enrollWithBody = async (req, res) => {
  const { courseId } = req.body || {};
  if (!courseId) {
    return res.status(400).json({
      success: false,
      message: "courseId is required",
    });
  }
  req.params = { ...req.params, courseId };
  return enrollInCourse(req, res);
};

// @desc    Enroll a student in a course
// @route   POST /api/courses/:courseId/enroll
// @access  Private (Student)
export const enrollInCourse = async (req, res) => {
  try {
    const enrollmentData = {
      studentId: req.user.id, // From authenticated user
      courseId: req.params.courseId, // From the URL
    };

    const newEnrollment = await enrollmentService.enrollInCourse(enrollmentData);

    // Fire-and-forget enrollment email, do not affect main flow
    try {
      const student = newEnrollment.studentId;
      const course = newEnrollment.courseId;

      if (student?.email && student?.name && course?.title) {
        await sendEnrollmentEmail(student.email, student.name, course.title);
      } else {
        console.warn(
          "[EnrollmentController] Missing student or course data for enrollment email",
          {
            hasStudent: !!student,
            hasCourse: !!course,
          }
        );
      }
    } catch (emailError) {
      console.error(
        "[EnrollmentController] Error while sending enrollment email",
        {
          message: emailError.message,
        }
      );
    }

    res.status(201).json({
      success: true,
      data: newEnrollment,
      message: "Successfully enrolled in course",
    });
  } catch (error) {
    // Handle course not found or inactive
    if (error.message === "Course not found") {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }
    if (error.message === "Cannot enroll in an inactive course") {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
    // Handle duplicate enrollment
    if (error.message === "Student is already enrolled in this course") {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
    // Handle MongoDB duplicate key error (backup check)
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Student is already enrolled in this course"
      });
    }
    // Handle validation errors
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all students enrolled in a specific course
// @route   GET /api/courses/:courseId/students
// @access  Private (Teacher/Admin)
export const getStudentsByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const enrollments = await enrollmentService.getEnrollmentsByCourse(courseId);

    const response = enrollments.map((enrollment) => ({
      _id: enrollment._id,
      student: enrollment.studentId
        ? {
          _id: enrollment.studentId._id,
          name: enrollment.studentId.name,
          email: enrollment.studentId.email,
        }
        : null,
      progress: enrollment.progressPercentage,
      completionStatus: enrollment.completionStatus,
    }));

    res.status(200).json(response);
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid course ID format",
      });
    }
    res.status(500).json({
      message: error.message,
    });
  }
};

// @desc    Get all enrollments for the current user
// @route   GET /api/enrollments/my
// @access  Private (Student)
export const getMyEnrollments = async (req, res) => {
  try {
    const enrollments = await enrollmentService.getMyEnrollments(req.user.id);

    // Shape response to match Postman spec
    const response = enrollments.map((enrollment) => ({
      _id: enrollment._id,
      course: enrollment.courseId
        ? {
          _id: enrollment.courseId._id,
          title: enrollment.courseId.title,
          category: enrollment.courseId.category,
          level: enrollment.courseId.level,
          duration: enrollment.courseId.duration,
          status: enrollment.courseId.status,
          imageUrl: enrollment.courseId.imageUrl,
          instructor: enrollment.courseId.createdBy
            ? {
                name: enrollment.courseId.createdBy.name,
              }
            : null,
        }
        : null,
      progress: enrollment.progressPercentage,
      completionStatus: enrollment.completionStatus,
    }));

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// @desc    List enrollments for a student (self or staff)
// @route   GET /api/enrollments/student/:studentId
// @access  Private
export const getStudentEnrollments = async (req, res) => {
  try {
    const { studentId } = req.params;
    const role = req.user.role?.toLowerCase();

    if (role === "student" && req.user.id !== studentId) {
      return res.status(403).json({
        success: false,
        message: "You can only view your own enrollments",
      });
    }

    const enrollments = await enrollmentService.getMyEnrollments(studentId);

    const response = enrollments.map((enrollment) => ({
      _id: enrollment._id,
      course: enrollment.courseId
        ? {
            _id: enrollment.courseId._id,
            title: enrollment.courseId.title,
            category: enrollment.courseId.category,
            level: enrollment.courseId.level,
            duration: enrollment.courseId.duration,
            status: enrollment.courseId.status,
            imageUrl: enrollment.courseId.imageUrl,
            instructor: enrollment.courseId.createdBy
              ? {
                  name: enrollment.courseId.createdBy.name,
                }
              : null,
          }
        : null,
      progress: enrollment.progressPercentage,
      completionStatus: enrollment.completionStatus,
    }));

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// @desc    Update progress percentage for an enrollment
// @route   PUT /api/enrollments/:id/progress
// @access  Private (Student)
export const updateProgress = async (req, res) => {
  try {
    const { progressPercentage } = req.body;

    if (progressPercentage === undefined || progressPercentage === null) {
      return res.status(400).json({
        success: false,
        message: "Progress percentage is required"
      });
    }

    const updatedEnrollment = await enrollmentService.updateProgress(
      req.params.id,
      progressPercentage
    );

    if (!updatedEnrollment) {
      return res.status(404).json({
        success: false,
        message: "Enrollment not found"
      });
    }

    // Verify that the enrollment belongs to the current user
    if (updatedEnrollment.studentId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You can only update your own enrollment progress"
      });
    }

    res.status(200).json({
      success: true,
      data: updatedEnrollment,
      message: "Progress updated successfully"
    });
  } catch (error) {
    // Handle validation errors
    if (error.message === "Progress percentage must be between 0 and 100") {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
    // Handle invalid ObjectId format
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid enrollment ID format"
      });
    }
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Partially update an enrollment (progress and/or completion)
// @route   PATCH /api/enrollments/:id
// @access  Private (Student)
export const updateEnrollment = async (req, res) => {
  try {
    const { progressPercentage, completed } = req.body;

    if (progressPercentage === undefined && completed === undefined) {
      return res.status(400).json({
        success: false,
        message: "Provide at least one of: progressPercentage, completed",
      });
    }

    const updatedEnrollment = await enrollmentService.updateEnrollment(
      req.params.id,
      { progressPercentage, completed }
    );

    if (!updatedEnrollment) {
      return res.status(404).json({
        success: false,
        message: "Enrollment not found",
      });
    }

    if (updatedEnrollment.studentId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You can only update your own enrollments",
      });
    }

    res.status(200).json({
      success: true,
      data: updatedEnrollment,
      message: "Enrollment updated successfully",
    });
  } catch (error) {
    if (error.message === "Progress percentage must be between 0 and 100") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid enrollment ID format",
      });
    }
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Mark a course as complete
// @route   PUT /api/enrollments/:id/complete
// @access  Private (Student)
export const markCourseComplete = async (req, res) => {
  try {
    const updatedEnrollment = await enrollmentService.markCourseComplete(
      req.params.id
    );

    if (!updatedEnrollment) {
      return res.status(404).json({
        success: false,
        message: "Enrollment not found",
      });
    }

    // Verify that the enrollment belongs to the current user
    if (updatedEnrollment.studentId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You can only mark your own enrollments as complete",
      });
    }

    // Fire-and-forget completion email, do not affect main flow
    try {
      const student = updatedEnrollment.studentId;
      const course = updatedEnrollment.courseId;

      if (student?.email && student?.name && course?.title) {
        await sendCompletionEmail(student.email, student.name, course.title);
      } else {
        console.warn(
          "[EnrollmentController] Missing student or course data for completion email",
          {
            hasStudent: !!student,
            hasCourse: !!course,
          }
        );
      }
    } catch (emailError) {
      console.error(
        "[EnrollmentController] Error while sending completion email",
        {
          message: emailError.message,
        }
      );
    }

    res.status(200).json({
      success: true,
      data: updatedEnrollment,
      message: "Course marked as completed successfully",
    });
  } catch (error) {
    // Handle invalid ObjectId format
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid enrollment ID format"
      });
    }
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
