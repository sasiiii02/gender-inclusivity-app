/**
 * Fail fast when perf env vars are missing (avoids noisy HTTP errors when the API is down or mis-targeted).
 */
const oid = /^[a-f0-9]{24}$/;

function jwtOk(token) {
  const t = String(token || "").trim();
  return t && t.split(".").length === 3 && !/[<>]/.test(t);
}

function validateQuizEnv(context, events, done) {
  const token = process.env.TEACHER_JWT;
  if (!jwtOk(token)) {
    return done(
      new Error(
        "[quiz-load-test]\n" +
          "TEACHER_JWT must be the raw JWT from POST /api/auth/login (teacher with at least one published quiz).\n" +
          "Set it in performance/.env.performance (run npm run perf:init if the file is missing).\n",
      ),
    );
  }
  return done();
}

function validateEventsEnv(context, events, done) {
  const campaignId = String(process.env.FIXED_CAMPAIGN_ID || "").trim();
  const token = process.env.TEACHER_OR_ADMIN_JWT;
  const lines = [];
  if (!oid.test(campaignId)) {
    lines.push(
      "FIXED_CAMPAIGN_ID must be a 24-character hex MongoDB _id for an existing campaign.",
    );
  }
  if (!jwtOk(token)) {
    lines.push(
      "TEACHER_OR_ADMIN_JWT must be the raw JWT from login (teacher or admin).",
    );
  }
  if (lines.length) {
    return done(
      new Error(
        "[event-campaign-load-test]\n" +
          lines.join("\n") +
          "\nSet variables in performance/.env.performance (npm run perf:init creates the file).\n",
      ),
    );
  }
  return done();
}

function validateReportEnv(context, events, done) {
  const categoryId = String(process.env.CATEGORY_ID || "").trim();
  const token = process.env.REPORT_USER_JWT;
  const lines = [];
  if (!jwtOk(token)) {
    lines.push(
      "REPORT_USER_JWT must be the raw JWT from POST /api/auth/login (any registered user).",
    );
  }
  if (!oid.test(categoryId)) {
    lines.push(
      "CATEGORY_ID must be a 24-character hex ReportCategory _id (e.g. from your DB or seed data).",
    );
  }
  if (lines.length) {
    return done(
      new Error(
        "[report-load-test]\n" +
          lines.join("\n") +
          "\nSet variables in performance/.env.performance (npm run perf:init creates the file).\n",
      ),
    );
  }
  return done();
}

module.exports = {
  validateQuizEnv,
  validateEventsEnv,
  validateReportEnv,
};
