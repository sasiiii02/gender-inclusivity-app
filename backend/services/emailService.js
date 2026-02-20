import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";

dotenv.config();

// Set the API Key from your .env file
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

export const sendRegistrationEmail = async (userEmail, userName, eventDetails) => {
  try {
    const msg = {
      to: userEmail,
      from: process.env.EMAIL_FROM || "no-reply@genderinclusivity.org", // Verify this email in SendGrid
      subject: `Registration Confirmed: ${eventDetails.title}`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h1 style="color: #2c3e50;">Registration Confirmed!</h1>
          <p>Hi ${userName},</p>
          <p>You have successfully registered for the <strong>${eventDetails.title}</strong>.</p>
          
          <div style="background: #f4f4f4; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Date:</strong> ${new Date(eventDetails.eventDate).toDateString()}</p>
            <p><strong>Location:</strong> ${eventDetails.location}</p>
            <p><strong>Speaker:</strong> ${eventDetails.speaker}</p>
          </div>

          <p>If you have specific accessibility needs (${eventDetails.accessibilityNeeds || "None"}), we have noted them.</p>
          
          <p>See you there!</p>
          <p><em>The Gender Inclusivity Team</em></p>
        </div>
      `,
    };

    if (process.env.SENDGRID_API_KEY) {
      await sgMail.send(msg);
      console.log(`📧 Email sent to ${userEmail}`);
    } else {
      console.warn("⚠️ SendGrid API Key missing. Email logged to console instead.");
    }
    
    return true;
  } catch (error) {
    console.error("Email Service Error:", error.response?.body || error.message);
    // We do NOT throw the error here because we don't want to crash the registration just because an email failed.
    return false;
  }
};