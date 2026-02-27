import Lesson from "../models/Lesson.js";
import Course from "../models/Course.js";

// 1. Add a lesson to a course (validate course exists first)
export const addLessonToCourse = async (lessonData) => {
  // Validate that the course exists
  const course = await Course.findById(lessonData.courseId);
  if (!course) {
    throw new Error("Course not found");
  }

  // Check if course is active
  if (course.status !== "Active") {
    throw new Error("Cannot add lesson to an inactive course");
  }

  const lesson = new Lesson(lessonData);
  return await lesson.save();
};

// 2. Get all lessons by course ID
export const getLessonsByCourse = async (courseId) => {
  // Validate that the course exists
  const course = await Course.findById(courseId);
  if (!course) {
    throw new Error("Course not found");
  }

  // Get lessons sorted by orderNumber
  const lessons = await Lesson.find({ courseId })
    .sort({ orderNumber: 1 }); // Sort by order number ascending

  return lessons;
};

// 3. Update a lesson
export const updateLesson = async (id, updateData) => {
  // If courseId is being updated, validate the new course exists
  if (updateData.courseId) {
    const course = await Course.findById(updateData.courseId);
    if (!course) {
      throw new Error("Course not found");
    }
  }

  // { new: true } returns the updated document, runValidators ensures schema rules still apply
  return await Lesson.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
};

// 4. Delete a lesson
export const deleteLesson = async (id) => {
  return await Lesson.findByIdAndDelete(id);
};
