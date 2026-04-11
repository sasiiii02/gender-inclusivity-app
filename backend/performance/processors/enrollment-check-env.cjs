/**
 * Artillery processor: fail fast with a clear message if perf env vars are missing or still placeholders.
 */
function validateEnrollmentEnv(context, events, done) {
  const oid = /^[a-f0-9]{24}$/;
  const courseId = String(process.env.COURSE_ID || "").trim();
  const studentId = String(process.env.STUDENT_ID || "").trim();
  const token = String(process.env.STUDENT_JWT || "").trim();

  const bad =
    /[<>]/.test(courseId) ||
    /[<>]/.test(studentId) ||
    /[<>]/.test(token) ||
    /real|paste|example|yourmongo|jwt/i.test(courseId + studentId + token);

  const lines = [];
  if (!oid.test(courseId)) {
    lines.push(
      "COURSE_ID must be a 24-character hexadecimal MongoDB ObjectId (an Active course).",
    );
  }
  if (!oid.test(studentId)) {
    lines.push(
      "STUDENT_ID must be the same student's 24-character hex _id (must match JWT payload `id`).",
    );
  }
  if (!token || token.split(".").length !== 3) {
    lines.push(
      "STUDENT_JWT must be the raw token string from POST /api/auth/login (three segments separated by dots). Do not include 'Bearer '.",
    );
  }
  if (bad) {
    lines.push(
      "Values still look like placeholders; remove <angle brackets> and instructional text.",
    );
  }

  if (lines.length) {
    const help =
      "\n\nSetup:\n" +
      "  1. Copy performance/env.performance.example → performance/.env.performance\n" +
      "  2. Fill COURSE_ID, STUDENT_ID, STUDENT_JWT with real values from your DB + login.\n" +
      "  3. Run: npm run perf:enrollment\n";
    return done(new Error("[enrollment-load-test]\n" + lines.join("\n") + help));
  }

  return done();
}

module.exports = { validateEnrollmentEnv };
