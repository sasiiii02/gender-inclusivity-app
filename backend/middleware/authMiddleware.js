import jwt from "jsonwebtoken";
import User from "../models/User.js";

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(401).json({ 
          success: false,
          message: "User not found" 
        });
      }

      next();

    } catch (error) {
      return res.status(401).json({ 
        success: false,
        message: "Not authorized, token failed" 
      });
    }
  }

  if (!token) {
    return res.status(401).json({ 
      success: false,
      message: "Not authorized, no token" 
    });
  }
};

/**
 * Role-based authorization middleware
 * @param {...string} roles - Allowed roles (student, teacher, admin)
 * @returns {Function} Express middleware function
 * 
 * Usage:
 * router.get("/route", protect, authorize("teacher", "admin"), controller);
 * 
 * Note: Must be used after protect middleware
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    // Check if user is authenticated (should be set by protect middleware)
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        message: "Authentication required. Please use protect middleware first." 
      });
    }

    // Check if user has a valid role
    if (!req.user.role) {
      return res.status(403).json({ 
        success: false, 
        message: "User role not found" 
      });
    }

    const userRole = req.user.role.toLowerCase();

    // Normalize allowed roles to lowercase for comparison
    const normalizedRoles = roles.map((role) => role.toLowerCase());

    // Check if user's role is in the allowed roles
    if (!normalizedRoles.includes(userRole)) {
      return res.status(403).json({ 
        success: false, 
        message: `Access denied. Required role(s): ${roles.join(", ")}. Your role: ${userRole}` 
      });
    }

    next();
  };
};

/**
 * Convenience middleware: Check if user is a Student
 */
export const isStudent = authorize("student");

/**
 * Convenience middleware: Check if user is a Teacher
 */
export const isTeacher = authorize("teacher");

/**
 * Convenience middleware: Check if user is an Admin
 */
export const isAdmin = authorize("admin");

/**
 * Convenience middleware: Check if user is Teacher or Admin
 */
export const isTeacherOrAdmin = authorize("teacher", "admin");

/**
 * Convenience middleware: Check if user is Student or Teacher
 */
export const isStudentOrTeacher = authorize("student", "teacher");

export default protect;
