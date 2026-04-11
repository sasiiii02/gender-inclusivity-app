import * as courseService from "../services/courseService.js";
import Course from "../models/Course.js";
import Lesson from "../models/Lesson.js";
import { uploadCourseImage } from "../utils/cloudinary/courseImage.js";
import { deleteCloudinaryAsset } from "../utils/cloudinary/deleteAsset.js";

// @desc    Create a new course
// @route   POST /api/courses
// @access  Private (Admin/Teacher)
export const createCourse = async (req, res) => {
  let uploadedImage = null;
  try {
    if (req.file) {
      uploadedImage = await uploadCourseImage(req.file.buffer, req.file.originalname);
    }

    // Attach the logged-in user's ID as the creator
    const courseData = {
      ...req.body,
      createdBy: req.user.id,
      ...(uploadedImage
        ? {
            imageUrl: uploadedImage.secure_url, // keep backward compatibility
            image: {
              url: uploadedImage.secure_url,
              publicId: uploadedImage.public_id,
              originalFilename: uploadedImage.original_filename,
              resourceType: uploadedImage.resource_type,
              format: uploadedImage.format,
              bytes: uploadedImage.bytes,
            },
          }
        : {}),
    };

    let newCourse;
    try {
      newCourse = await courseService.createCourse(courseData);
    } catch (serviceErr) {
      if (uploadedImage?.public_id) {
        await deleteCloudinaryAsset(uploadedImage.public_id, uploadedImage.resource_type).catch(
          () => {}
        );
      }
      throw serviceErr;
    }

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
  let uploadedImage = null;
  try {
    const existingCourse = await Course.findById(req.params.id);
    if (!existingCourse) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    let courseDataToUpdate = { ...req.body };

    if (req.file) {
      uploadedImage = await uploadCourseImage(req.file.buffer, req.file.originalname);

      courseDataToUpdate.imageUrl = uploadedImage.secure_url; // backward compatibility
      courseDataToUpdate.image = {
        url: uploadedImage.secure_url,
        publicId: uploadedImage.public_id,
        originalFilename: uploadedImage.original_filename,
        resourceType: uploadedImage.resource_type,
        format: uploadedImage.format,
        bytes: uploadedImage.bytes,
      };
    }

    let updatedCourse;
    try {
      updatedCourse = await courseService.updateCourse(req.params.id, courseDataToUpdate);
    } catch (serviceErr) {
      if (uploadedImage?.public_id) {
        await deleteCloudinaryAsset(uploadedImage.public_id, uploadedImage.resource_type).catch(
          () => {}
        );
      }
      throw serviceErr;
    }

    if (uploadedImage?.public_id && existingCourse.image?.publicId) {
      await deleteCloudinaryAsset(existingCourse.image.publicId, existingCourse.image.resourceType).catch(
        () => {}
      );
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

// @desc    Delete a course completely
// @route   DELETE /api/courses/:id
// @access  Private (Admin/Teacher)
export const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Best-effort: delete course image from Cloudinary (do not fail deletion if Cloudinary fails)
    if (course.image?.publicId) {
      await deleteCloudinaryAsset(course.image.publicId, course.image.resourceType).catch(
        () => {}
      );
    }

    // Best-effort: delete lesson PDFs under this course (they'll be removed from DB by service)
    const lessons = await Lesson.find({ courseId: course._id }).select("pdf.publicId pdf.resourceType");
    await Promise.all(
      lessons.map((l) => {
        const publicId = l?.pdf?.publicId;
        if (!publicId) return Promise.resolve();
        return deleteCloudinaryAsset(publicId, l.pdf.resourceType).catch(() => {});
      })
    );

    const deletedCourse = await courseService.deleteCourse(req.params.id);
    if (!deletedCourse) {
      return res.status(404).json({ 
        success: false, 
        message: "Course not found" 
      });
    }
    res.status(200).json({ 
      success: true, 
      message: "Course and associated data deleted successfully" 
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
