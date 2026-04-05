import * as courseService from "../services/courseService.js";
import { uploadImageToCloudinary } from "../utils/cloudinaryUtils.js";

// @desc    Create a new course
// @route   POST /api/courses
// @access  Private (Admin/Teacher)
export const createCourse = async (req, res) => {
  try {
    let imageUrl = null;
    if (req.file) {
      const uploadResult = await uploadImageToCloudinary(
        req.file.buffer,
        req.file.originalname
      );
      imageUrl = uploadResult.secure_url;
    }

    // Attach the logged-in user's ID as the creator
    const courseData = {
      ...req.body,
      createdBy: req.user.id,
      ...(imageUrl && { imageUrl }),
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
// @access  Private (Any authenticated user)
export const getCourseById = async (req, res) => {
  try {
    const course = await courseService.getCourseById(req.params.id);
    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }
    // Match Postman spec: return the raw course object
    res.status(200).json(course);
  } catch (error) {
    // Handle invalid ObjectId format
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

// @desc    Update a course
// @route   PUT /api/courses/:id
// @access  Private (Admin/Teacher)
export const updateCourse = async (req, res) => {
  try {
    let courseDataToUpdate = { ...req.body };

    if (req.file) {
      const uploadResult = await uploadImageToCloudinary(
        req.file.buffer,
        req.file.originalname
      );
      courseDataToUpdate.imageUrl = uploadResult.secure_url;
    }

    const updatedCourse = await courseService.updateCourse(req.params.id, courseDataToUpdate);
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
