import * as registrationService from "../services/eRegistrationService.js";

// @desc    Register a student for an event
// @route   POST /api/events/:eventId/register
// @access  Private (Student/Teacher)
export const registerForEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const userId = req.user.id; // Securely extracted from JWT
    const { accessibilityNeeds } = req.body;

    const registration = await registrationService.registerStudent(eventId, userId, accessibilityNeeds);
    
    res.status(201).json({ 
      success: true, 
      data: registration, 
      message: "Successfully registered for the event. A confirmation email is on the way!" 
    });
  } catch (error) {
    // 400 Bad Request is perfect here since it's usually a "Full Capacity" or "Double Booking" error
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Get all registrations for a specific event
// @route   GET /api/events/:eventId/registrations
// @access  Private (Admin/Teacher)
export const getEventRegistrations = async (req, res) => {
  try {
    const registrations = await registrationService.getEventRegistrations(req.params.eventId);
    res.status(200).json({ success: true, data: registrations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all registrations for the logged-in student
// @route   GET /api/users/me/registrations
// @access  Private (Student)
export const getMyRegistrations = async (req, res) => {
  try {
    const myRegistrations = await registrationService.getStudentRegistrations(req.user.id);
    res.status(200).json({ success: true, data: myRegistrations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Cancel a registration
// @route   DELETE /api/registrations/:id
// @access  Private (Student)
export const cancelRegistration = async (req, res) => {
  try {
    const result = await registrationService.cancelRegistration(req.params.id, req.user.id);
    res.status(200).json({ success: true, message: result.message });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update attendance status
// @route   PATCH /api/registrations/:id/attend
// @access  Private (Teacher/Admin)
export const markAttendance = async (req, res) => {
  try {
    // We expect the body to have { "status": "Attended" }
    const { status } = req.body; 
    const updatedRegistration = await registrationService.markAttendance(req.params.id, status);
    
    res.status(200).json({ 
      success: true, 
      data: updatedRegistration,
      message: `Attendance marked as ${status}` 
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};