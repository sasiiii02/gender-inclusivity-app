import * as lessonService from "../services/lessonService.js";

// @desc    Add a lesson to a course
// @route   POST /api/courses/:courseId/lessons
// @access  Private (Admin/Teacher)
export const addLessonToCourse = async (req, res) => {
  try {
    const lessonData = {
      ...req.body,
      courseId: req.params.courseId, // From the URL
    };

    const newLesson = await lessonService.addLessonToCourse(lessonData);
    res.status(201).json({ 
      success: true, 
      data: newLesson, 
      message: "Lesson added to course successfully" 
    });
  } catch (error) {
    // Handle course not found or inactive
    if (error.message === "Course not found") {
      return res.status(404).json({ 
        success: false, 
        message: error.message 
      });
    }
    if (error.message === "Cannot add lesson to an inactive course") {
      return res.status(400).json({ 
        success: false, 
        message: error.message 
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

// @desc    Get all lessons by course ID
// @route   GET /api/courses/:courseId/lessons
// @access  Public
export const getLessonsByCourse = async (req, res) => {
  try {
    const lessons = await lessonService.getLessonsByCourse(req.params.courseId);
    res.status(200).json({ 
      success: true, 
      data: lessons 
    });
  } catch (error) {
    // Handle course not found
    if (error.message === "Course not found") {
      return res.status(404).json({ 
        success: false, 
        message: error.message 
      });
    }
    // Handle invalid ObjectId format
    if (error.name === "CastError") {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid course ID format" 
      });
    }
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// @desc    Update a lesson
// @route   PUT /api/lessons/:id
// @access  Private (Admin/Teacher)
export const updateLesson = async (req, res) => {
  try {
    const updatedLesson = await lessonService.updateLesson(req.params.id, req.body);
    if (!updatedLesson) {
      return res.status(404).json({ 
        success: false, 
        message: "Lesson not found" 
      });
    }
    res.status(200).json({ 
      success: true, 
      data: updatedLesson, 
      message: "Lesson updated successfully" 
    });
  } catch (error) {
    // Handle course not found (if courseId is being updated)
    if (error.message === "Course not found") {
      return res.status(404).json({ 
        success: false, 
        message: error.message 
      });
    }
    // Handle validation errors
    if (error.name === "ValidationError") {
      return res.status(400).json({ 
        success: false, 
        message: error.message 
      });
    }
    // Handle invalid ObjectId format
    if (error.name === "CastError") {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid lesson ID format" 
      });
    }
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// @desc    Delete a lesson
// @route   DELETE /api/lessons/:id
// @access  Private (Admin/Teacher)
export const deleteLesson = async (req, res) => {
  try {
    const deletedLesson = await lessonService.deleteLesson(req.params.id);
    if (!deletedLesson) {
      return res.status(404).json({ 
        success: false, 
        message: "Lesson not found" 
      });
    }
    res.status(200).json({ 
      success: true, 
      message: "Lesson deleted successfully" 
    });
  } catch (error) {
    // Handle invalid ObjectId format
    if (error.name === "CastError") {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid lesson ID format" 
      });
    }
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};
