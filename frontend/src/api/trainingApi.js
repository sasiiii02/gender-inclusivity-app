import axiosInstance from "./axiosInstance";

// Course APIs
export const getAllCourses = () => axiosInstance.get("/courses");
export const getCourseById = (courseId) => axiosInstance.get(`/courses/${courseId}`);
export const createCourse = (courseData) => axiosInstance.post("/courses", courseData);
export const updateCourse = (courseId, updatedData) =>
  axiosInstance.put(`/courses/${courseId}`, updatedData);
export const deleteCourse = (courseId) => axiosInstance.delete(`/courses/${courseId}`);

// Lesson APIs
export const addLesson = (courseId, lessonData) =>
  axiosInstance.post(`/courses/${courseId}/lessons`, lessonData);
export const getLessonsByCourse = (courseId) =>
  axiosInstance.get(`/courses/${courseId}/lessons`);
export const updateLesson = (lessonId, updatedData) =>
  axiosInstance.put(`/lessons/${lessonId}`, updatedData);
export const deleteLesson = (lessonId) => axiosInstance.delete(`/lessons/${lessonId}`);

// Enrollment APIs
export const enrollInCourse = (courseId) => axiosInstance.post(`/courses/${courseId}/enroll`, {});
export const getMyEnrollments = () => axiosInstance.get("/enrollments/my");
export const updateEnrollmentProgress = (enrollmentId, progressData) =>
  axiosInstance.put(`/enrollments/${enrollmentId}/progress`, progressData);
export const markCourseComplete = (enrollmentId) =>
  axiosInstance.put(`/enrollments/${enrollmentId}/complete`, {});
export const getStudentsByCourse = (courseId) => axiosInstance.get(`/courses/${courseId}/students`);

