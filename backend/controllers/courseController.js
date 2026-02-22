import * as courseService from "../services/courseService.js";

// @desc    Create a new course
// @route   POST /api/courses
// @access  Private (Admin/Teacher)
export const createCourse = async (req, res) => {
  try {
    // Attach the logged-in user's ID as the creator
    const courseData = {
      ...req.body,
      createdBy: req.user.id,
    };

    const newCourse = await courseService.createCourse(courseData);
    res.status(201).json({ 
      success: true, 
      data: newCourse, 
      message: "Course created successfully" 
    });
  } catch (error) {
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

// @desc    Get all courses (with filtering & pagination)
// @route   GET /api/courses
// @access  Public
export const getAllCourses = async (req, res) => {
  try {
    const result = await courseService.getAllCourses(req.query);
    res.status(200).json({ 
      success: true, 
      data: result 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// @desc    Get single course by ID
// @route   GET /api/courses/:id
// @access  Public
export const getCourseById = async (req, res) => {
  try {
    const course = await courseService.getCourseById(req.params.id);
    if (!course) {
      return res.status(404).json({ 
        success: false, 
        message: "Course not found" 
      });
    }
    res.status(200).json({ 
      success: true, 
      data: course 
    });
  } catch (error) {
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

// @desc    Update a course
// @route   PUT /api/courses/:id
// @access  Private (Admin/Teacher)
export const updateCourse = async (req, res) => {
  try {
    const updatedCourse = await courseService.updateCourse(req.params.id, req.body);
    if (!updatedCourse) {
      return res.status(404).json({ 
        success: false, 
        message: "Course not found" 
      });
    }
    res.status(200).json({ 
      success: true, 
      data: updatedCourse, 
      message: "Course updated successfully" 
    });
  } catch (error) {
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
        message: "Invalid course ID format" 
      });
    }
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// @desc    Soft Delete a course (change status to Inactive)
// @route   DELETE /api/courses/:id
// @access  Private (Admin/Teacher)
export const deleteCourse = async (req, res) => {
  try {
    const deletedCourse = await courseService.deleteCourse(req.params.id);
    if (!deletedCourse) {
      return res.status(404).json({ 
        success: false, 
        message: "Course not found" 
      });
    }
    res.status(200).json({ 
      success: true, 
      message: "Course deleted successfully (status set to Inactive)" 
    });
  } catch (error) {
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
