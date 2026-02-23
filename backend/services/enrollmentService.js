import Enrollment from "../models/Enrollment.js";
import Course from "../models/Course.js";

// 1. Enroll a student in a course (prevent duplicate enrollment)
export const enrollInCourse = async (enrollmentData) => {
  // Validate that the course exists
  const course = await Course.findById(enrollmentData.courseId);
  if (!course) {
    throw new Error("Course not found");
  }

  // Check if course is active
  if (course.status !== "Active") {
    throw new Error("Cannot enroll in an inactive course");
  }

  // Check if enrollment already exists
  const existingEnrollment = await Enrollment.findOne({
    studentId: enrollmentData.studentId,
    courseId: enrollmentData.courseId,
  });

  if (existingEnrollment) {
    throw new Error("Student is already enrolled in this course");
  }

  const enrollment = new Enrollment(enrollmentData);
  return await enrollment.save();
};

// 2. Get all enrollments for a student
export const getMyEnrollments = async (studentId) => {
  const enrollments = await Enrollment.find({ studentId })
    .populate("courseId", "title description category level duration status")
    .sort({ enrollmentDate: -1 }); // Newest enrollments first

  return enrollments;
};

// 3. Update progress percentage
export const updateProgress = async (enrollmentId, progressPercentage) => {
  // Validate progress percentage is between 0 and 100
  if (progressPercentage < 0 || progressPercentage > 100) {
    throw new Error("Progress percentage must be between 0 and 100");
  }

  const updateData = { progressPercentage };

  // If progress reaches 100%, automatically mark as completed
  if (progressPercentage === 100) {
    updateData.completionStatus = "Completed";
    updateData.completedAt = new Date();
  }

  // { new: true } returns the updated document, runValidators ensures schema rules still apply
  return await Enrollment.findByIdAndUpdate(
    enrollmentId,
    updateData,
    { new: true, runValidators: true }
  );
};

// 4. Mark course as complete
export const markCourseComplete = async (enrollmentId) => {
  const updateData = {
    completionStatus: "Completed",
    progressPercentage: 100,
    completedAt: new Date(),
  };

  // { new: true } returns the updated document, runValidators ensures schema rules still apply
  return await Enrollment.findByIdAndUpdate(
    enrollmentId,
    updateData,
    { new: true, runValidators: true }
  );
};

// 5. Partial update (for PATCH) - progress and/or completion
export const updateEnrollment = async (enrollmentId, updates) => {
  const { progressPercentage, completed } = updates;

  if (completed === true) {
    return await markCourseComplete(enrollmentId);
  }
  if (progressPercentage !== undefined && progressPercentage !== null) {
    return await updateProgress(enrollmentId, progressPercentage);
  }

  return await Enrollment.findById(enrollmentId);
};
