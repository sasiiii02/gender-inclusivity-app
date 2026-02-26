import mongoose from "mongoose";
import ERegistration from "../models/ERegistration.js";
import EEvent from "../models/EEvent.js";
import User from "../models/User.js";
import { sendRegistrationEmail } from "./emailService.js";

// 1. Register a student for an event (With Transaction)
export const registerStudent = async (eventId, userId, accessibilityNeeds) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // A. Check if event exists and calculate atomic capacity
    const event = await EEvent.findById(eventId).session(session);
    if (!event) {
      throw new Error("Event not found");
    }

    if (event.registeredCount >= event.capacity) {
      throw new Error("Event is fully booked");
    }

    if (event.status !== "Published") {
      throw new Error("Registration is not open for this event");
    }

    // B. Check if user already registered (Double check in logic, though DB index handles this too)
    const existingRegistration = await ERegistration.findOne({ eventId, userId }).session(session);
    if (existingRegistration) {
      throw new Error("User already registered for this event");
    }

    // C. Create Registration
    const registration = new ERegistration({
      eventId,
      userId,
      accessibilityNeeds,
      attendanceStatus: "Registered",
    });
    await registration.save({ session });

    // D. Atomically increment the event count
    event.registeredCount += 1;
    await event.save({ session });

    // Commit the transaction (Save everything permanently)
    await session.commitTransaction();
    session.endSession();

    // E. Send Email (Outside transaction because it's an external API call)
    // We fetch user details first
    const user = await User.findById(userId);
    if (user) {
      await sendRegistrationEmail(user.email, user.name, {
        title: event.title,
        eventDate: event.eventDate,
        location: event.location,
        speaker: event.speaker,
        accessibilityNeeds: accessibilityNeeds,
      });
    }

    return registration;

  } catch (error) {
    // If anything fails, rollback EVERYTHING
    await session.abortTransaction();
    session.endSession();
    throw error; // Re-throw to be caught by the controller
  }
};

// 2. Get registrations for a specific event (Admin/Teacher view)
export const getEventRegistrations = async (eventId) => {
  return await ERegistration.find({ eventId })
    .populate("userId", "name email role") // Show student details
    .sort({ createdAt: -1 });
};

// 3. Get registrations for a specific student (My Registrations)
export const getStudentRegistrations = async (userId) => {
  return await ERegistration.find({ userId })
    .populate({
      path: "eventId",
      select: "title eventDate location status", // Only show necessary event details
      populate: { path: "campaignId", select: "title" } // Deep populate campaign title
    })
    .sort({ createdAt: -1 });
};

// 4. Cancel Registration
export const cancelRegistration = async (registrationId, userId) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const registration = await ERegistration.findById(registrationId).session(session);
    
    if (!registration) throw new Error("Registration not found");
    if (registration.userId.toString() !== userId.toString()) {
        // In a real app, Admins should be able to delete anyone's, but for now strict ownership
        throw new Error("Not authorized to cancel this registration");
    }

    // Remove registration
    await ERegistration.findByIdAndDelete(registrationId).session(session);

    // Decrement event count
    await EEvent.findByIdAndUpdate(
      registration.eventId,
      { $inc: { registeredCount: -1 } },
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    return { message: "Registration cancelled successfully" };

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

// 5. Mark Attendance (PATCH)
export const markAttendance = async (registrationId, status) => {
  const validStatuses = ["Registered", "Attended", "Cancelled", "No-Show"];
  
  if (!validStatuses.includes(status)) {
    throw new Error("Invalid attendance status");
  }

  const registration = await ERegistration.findByIdAndUpdate(
    registrationId,
    { attendanceStatus: status },
    { new: true, runValidators: true }
  );

  if (!registration) throw new Error("Registration not found");
  
  return registration;
};