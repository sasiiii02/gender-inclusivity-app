import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";
const { BREVO_API_KEY, EMAIL_FROM } = process.env;

const isEmailConfigured = () => {
  if (!BREVO_API_KEY || !EMAIL_FROM) {
    console.warn(
      "[BrevoEmailService] Missing BREVO_API_KEY or EMAIL_FROM in environment. Skipping email send."
    );
    return false;
  }
  return true;
};

const brevoClient = axios.create({
  baseURL: BREVO_API_URL,
  headers: {
    "api-key": BREVO_API_KEY,
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

export const sendEnrollmentEmail = async (toEmail, studentName, courseTitle) => {
  if (!isEmailConfigured()) return;

  const payload = {
    sender: { email: EMAIL_FROM },
    to: [{ email: toEmail, name: studentName }],
    subject: `Enrollment confirmed: ${courseTitle}`,
    htmlContent: `
      <html>
        <body>
          <p>Hi ${studentName},</p>
          <p>You have been successfully enrolled in <strong>${courseTitle}</strong>.</p>
          <p>We’re excited to have you on board!</p>
        </body>
      </html>
    `,
  };

  try {
    const response = await brevoClient.post("", payload);
    console.log(
      "[BrevoEmailService] Enrollment email sent successfully",
      {
        to: toEmail,
        courseTitle,
        status: response.status,
        data: response.data,
      }
    );
  } catch (error) {
    console.error(
      "[BrevoEmailService] Failed to send enrollment email",
      {
        to: toEmail,
        courseTitle,
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      }
    );
  }
};

export const sendCompletionEmail = async (toEmail, studentName, courseTitle) => {
  if (!isEmailConfigured()) return;

  const payload = {
    sender: { email: EMAIL_FROM },
    to: [{ email: toEmail, name: studentName }],
    subject: `Congratulations on completing: ${courseTitle}`,
    htmlContent: `
      <html>
        <body>
          <p>Hi ${studentName},</p>
          <p>Congratulations on completing <strong>${courseTitle}</strong>!</p>
          <p>Great job on your achievement.</p>
        </body>
      </html>
    `,
  };

  try {
    const response = await brevoClient.post("", payload);
    console.log(
      "[BrevoEmailService] Completion email sent successfully",
      {
        to: toEmail,
        courseTitle,
        status: response.status,
        data: response.data,
      }
    );
  } catch (error) {
    console.error(
      "[BrevoEmailService] Failed to send completion email",
      {
        to: toEmail,
        courseTitle,
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      }
    );
  }
};

