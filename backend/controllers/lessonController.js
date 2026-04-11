import * as lessonService from "../services/lessonService.js";
import Lesson from "../models/Lesson.js";
import { uploadLessonPdf } from "../utils/cloudinary/lessonPdf.js";
import { deleteCloudinaryAsset } from "../utils/cloudinary/deleteAsset.js";

// @desc    Add a lesson to a course
// @route   POST /api/courses/:courseId/lessons
// @access  Private (Admin/Teacher)
export const addLessonToCourse = async (req, res) => {
  let uploadedPdf = null;
  try {
    let pdfData = undefined;
    if (req.file) {
      uploadedPdf = await uploadLessonPdf(req.file.buffer, req.file.originalname);
      pdfData = {
        url: uploadedPdf.secure_url,
        publicId: uploadedPdf.public_id,
        originalFilename: uploadedPdf.original_filename,
        resourceType: uploadedPdf.resource_type,
        format: uploadedPdf.format,
        bytes: uploadedPdf.bytes,
      };
    }

    const lessonData = {
      ...req.body,
      courseId: req.params.courseId,
    };
    if (pdfData) lessonData.pdf = pdfData;

    try {
      const newLesson = await lessonService.addLessonToCourse(lessonData);
      res.status(201).json({ 
        success: true, 
        data: newLesson, 
        message: "Lesson added to course successfully" 
      });
    } catch (serviceErr) {
      // Cleanup Cloudinary if DB failed
      if (uploadedPdf?.public_id) {
        await deleteCloudinaryAsset(uploadedPdf.public_id, uploadedPdf.resource_type).catch(
          () => {}
        );
      }
      throw serviceErr;
    }
  } catch (error) {
    if (error.message === "Invalid PDF file content.") {
      return res.status(400).json({ success: false, message: "Only valid PDF files are allowed." });
    }
    if (error.message === "Course not found") {
      return res.status(404).json({ success: false, message: error.message });
    }
    if (error.message === "Cannot add lesson to an inactive course") {
      return res.status(400).json({ success: false, message: error.message });
    }
    if (error.name === "ValidationError") {
      return res.status(400).json({ success: false, message: error.message });
    }
    res.status(500).json({ success: false, message: error.message });
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
    if (error.message === "Course not found") {
      return res.status(404).json({ success: false, message: error.message });
    }
    if (error.name === "CastError") {
      return res.status(400).json({ success: false, message: "Invalid course ID format" });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update a lesson
// @route   PUT /api/lessons/:id
// @access  Private (Admin/Teacher)
export const updateLesson = async (req, res) => {
  let uploadedPdf = null;
  try {
    const oldLesson = await Lesson.findById(req.params.id);
    if (!oldLesson) {
      return res.status(404).json({ success: false, message: "Lesson not found" });
    }

    let newPdfData = undefined;
    if (req.file) {
      uploadedPdf = await uploadLessonPdf(req.file.buffer, req.file.originalname);
      newPdfData = {
        url: uploadedPdf.secure_url,
        publicId: uploadedPdf.public_id,
        originalFilename: uploadedPdf.original_filename,
        resourceType: uploadedPdf.resource_type,
        format: uploadedPdf.format,
        bytes: uploadedPdf.bytes,
      };
    }

    const updateData = { ...req.body };
    if (newPdfData) updateData.pdf = newPdfData;

    try {
      const updatedLesson = await lessonService.updateLesson(req.params.id, updateData);
      
      // Cleanup old PDF if new PDF was properly saved
      if (newPdfData && oldLesson.pdf && oldLesson.pdf.publicId) {
        await deleteCloudinaryAsset(oldLesson.pdf.publicId, oldLesson.pdf.resourceType).catch(
          () => {}
        );
      }

      res.status(200).json({ 
        success: true, 
        data: updatedLesson, 
        message: "Lesson updated successfully" 
      });
    } catch (serviceErr) {
      // Cleanup new PDF if saving to DB failed
      if (uploadedPdf?.public_id) {
        await deleteCloudinaryAsset(uploadedPdf.public_id, uploadedPdf.resource_type).catch(
          () => {}
        );
      }
      throw serviceErr;
    }
  } catch (error) {
    if (error.message === "Invalid PDF file content.") {
      return res.status(400).json({ success: false, message: "Only valid PDF files are allowed." });
    }
    if (error.message === "Course not found") {
      return res.status(404).json({ success: false, message: error.message });
    }
    if (error.name === "ValidationError" || error.name === "CastError") {
      return res.status(400).json({ success: false, message: "Validation error or Invalid ID" });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Partially update a lesson
// @route   PATCH /api/lessons/:id
// @access  Private (Teacher/Admin)
export const patchLesson = async (req, res) => {
  // Let updateLesson handle file logic cleanly; simple patch defers to logic as needed,
  // but since we support robust updateLesson, we delegate file replacement there natively.
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: "Validation Error" });
    }

    // Pass body smoothly assuming no file in PATCH context usually, else adapt
    const updatedLesson = await lessonService.updateLesson(req.params.id, req.body);
    if (!updatedLesson) {
      return res.status(404).json({ message: "Lesson not found" });
    }

    res.status(200).json({
      message: "Lesson updated successfully",
      lesson: updatedLesson,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a lesson
// @route   DELETE /api/lessons/:id
// @access  Private (Admin/Teacher)
export const deleteLesson = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) {
      return res.status(404).json({ success: false, message: "Lesson not found" });
    }

    if (lesson.pdf && lesson.pdf.publicId) {
      await deleteCloudinaryAsset(lesson.pdf.publicId, lesson.pdf.resourceType).catch(() => {});
    }

    await lessonService.deleteLesson(req.params.id);
    res.status(200).json({ success: true, message: "Lesson deleted successfully" });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ success: false, message: "Invalid lesson ID format" });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};
