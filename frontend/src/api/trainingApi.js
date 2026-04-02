import axiosInstance from "./axiosInstance";

// Courses
export const getAllCourses = (query = {}) =>
  axiosInstance.get("/courses", { params: query });

export const getCourseById = (courseId) =>
  axiosInstance.get(`/courses/${courseId}`);

export const createCourse = (data) => axiosInstance.post("/courses", data);

export const updateCourse = (courseId, data) =>
  axiosInstance.put(`/courses/${courseId}`, data);

export const patchCourse = (courseId, data) =>
  axiosInstance.patch(`/courses/${courseId}`, data);

export const deleteCourse = (courseId) => axiosInstance.delete(`/courses/${courseId}`);

// Lessons
export const getLessonsByCourse = (courseId) =>
  axiosInstance.get(`/courses/${courseId}/lessons`);

export const addLessonToCourse = (courseId, data) =>
  axiosInstance.post(`/courses/${courseId}/lessons`, data);

export const updateLesson = (lessonId, data) =>
  axiosInstance.put(`/lessons/${lessonId}`, data);

export const patchLesson = (lessonId, data) =>
  axiosInstance.patch(`/lessons/${lessonId}`, data);

export const deleteLesson = (lessonId) => axiosInstance.delete(`/lessons/${lessonId}`);

// Enrollment / Progress
export const enrollInCourse = (courseId) =>
  // Backend derives studentId from auth token and uses courseId from the URL.
  axiosInstance.post(`/courses/${courseId}/enroll`, {});

export const getMyEnrollments = () => axiosInstance.get("/enrollments/my");

export const updateProgress = (enrollmentId, progressPercentage) =>
  axiosInstance.put(`/enrollments/${enrollmentId}/progress`, {
    progressPercentage,
  });

export const markCourseComplete = (enrollmentId) =>
  axiosInstance.put(`/enrollments/${enrollmentId}/complete`, {});

export const updateEnrollment = (enrollmentId, payload) =>
  axiosInstance.patch(`/enrollments/${enrollmentId}`, payload);

// Teacher: students enrolled in a course
export const getStudentsByCourse = (courseId) =>
  axiosInstance.get(`/courses/${courseId}/students`);

