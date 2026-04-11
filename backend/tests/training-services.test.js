import test, { afterEach } from "node:test";
import assert from "node:assert/strict";

import Enrollment from "../models/Enrollment.js";
import Course from "../models/Course.js";
import * as enrollmentService from "../services/enrollmentService.js";

const originalCourseFindById = Course.findById;
const originalEnrollmentFindOne = Enrollment.findOne;
const originalEnrollmentFindByIdAndUpdate = Enrollment.findByIdAndUpdate;
const originalEnrollmentPrototypeSave = Enrollment.prototype.save;

function restoreEnrollmentMocks() {
  Course.findById = originalCourseFindById;
  Enrollment.findOne = originalEnrollmentFindOne;
  Enrollment.findByIdAndUpdate = originalEnrollmentFindByIdAndUpdate;
  Enrollment.prototype.save = originalEnrollmentPrototypeSave;
}

afterEach(() => {
  restoreEnrollmentMocks();
});

test("enrollInCourse creates enrollment for valid active course", async () => {
  const studentId = "507f1f77bcf86cd799439011";
  const courseId = "507f1f77bcf86cd799439012";

  Course.findById = async () => ({ _id: courseId, status: "Active" });
  Enrollment.findOne = async () => null;
  Enrollment.prototype.save = async function saveMock() {
    return {
      studentId: this.studentId,
      courseId: this.courseId,
      completionStatus: this.completionStatus,
      progressPercentage: this.progressPercentage,
    };
  };

  const result = await enrollmentService.enrollInCourse({
    studentId,
    courseId,
  });

  assert.equal(result.studentId.toString(), studentId);
  assert.equal(result.courseId.toString(), courseId);
  assert.equal(result.progressPercentage, 0);
  assert.equal(result.completionStatus, "In Progress");

});

test("enrollInCourse rejects duplicate enrollment", async () => {
  Course.findById = async () => ({ _id: "course-1", status: "Active" });
  Enrollment.findOne = async () => ({ _id: "existing-enrollment" });

  await assert.rejects(
    () =>
      enrollmentService.enrollInCourse({
        studentId: "student-1",
        courseId: "course-1",
      }),
    /already enrolled/i
  );

});

test("updateProgress rejects values outside 0..100", async () => {
  await assert.rejects(
    () => enrollmentService.updateProgress("enrollment-1", 150),
    /between 0 and 100/i
  );
});

test("updateProgress auto-completes when progress is 100", async () => {
  let capturedUpdateData;

  Enrollment.findByIdAndUpdate = async (_id, updateData) => {
    capturedUpdateData = updateData;
    return { _id: "enrollment-1", ...updateData };
  };

  const result = await enrollmentService.updateProgress("enrollment-1", 100);

  assert.equal(result.progressPercentage, 100);
  assert.equal(capturedUpdateData.completionStatus, "Completed");
  assert.ok(capturedUpdateData.completedAt instanceof Date);

});

test("markCourseComplete sets complete state and completion date", async () => {
  let capturedUpdateData;

  Enrollment.findByIdAndUpdate = (_id, updateData) => {
    capturedUpdateData = updateData;
    const chain = {
      populate() {
        return chain;
      },
    };
    return chain;
  };

  await enrollmentService.markCourseComplete("enrollment-1");

  assert.equal(capturedUpdateData.progressPercentage, 100);
  assert.equal(capturedUpdateData.completionStatus, "Completed");
  assert.ok(capturedUpdateData.completedAt instanceof Date);

});
