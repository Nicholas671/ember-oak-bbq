const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
require("dotenv").config();

// Create reusable transporter
let transporter;

const getTransporter = () => {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || "smtp.gmail.com",
      port: parseInt(process.env.EMAIL_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }
  return transporter;
};

// POST /api/contact — send a contact message
router.post("/", async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    // Validation
    if (!name || !email || !message) {
      return res.status(400).json({ error: "Name, email, and message are required." });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Please provide a valid email address." });
    }

    // Build email content
    const htmlContent = `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #8B2500; padding: 20px; text-align: center;">
          <h1 style="color: #F5DEB3; margin: 0;">Ember & Oak BBQ</h1>
          <p style="color: #DEB887; margin: 5px 0 0;">New Contact Form Submission</p>
        </div>
        <div style="padding: 30px; background: #FFF8F0; border: 1px solid #DEB887;">
          <h2 style="color: #8B2500; margin-top: 0;">Message Details</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #5C3317; width: 100px;">Name:</td>
              <td style="padding: 8px 0;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #5C3317;">Email:</td>
              <td style="padding: 8px 0;"><a href="mailto:${email}">${email}</a></td>
            </tr>
            ${phone ? `<tr>
              <td style="padding: 8px 0; font-weight: bold; color: #5C3317;">Phone:</td>
              <td style="padding: 8px 0;">${phone}</td>
            </tr>` : ""}
            ${subject ? `<tr>
              <td style="padding: 8px 0; font-weight: bold; color: #5C3317;">Subject:</td>
              <td style="padding: 8px 0;">${subject}</td>
            </tr>` : ""}
          </table>
          <hr style="border: 1px solid #DEB887; margin: 20px 0;">
          <h3 style="color: #8B2500;">Message:</h3>
          <p style="line-height: 1.6; color: #333;">${message.replace(/\n/g, "<br>")}</p>
        </div>
        <div style="background: #5C3317; padding: 15px; text-align: center;">
          <p style="color: #DEB887; margin: 0; font-size: 12px;">
            This message was sent from the Ember & Oak BBQ website contact form.
          </p>
        </div>
      </div>
    `;

    // Send email
    const mailOptions = {
      from: `"Ember & Oak Website" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
      replyTo: email,
      subject: `[Website Contact] ${subject || "New message"} from ${name}`,
      html: htmlContent,
      text: `New contact from ${name} (${email}${phone ? ", " + phone : ""})\n\n${subject ? "Subject: " + subject + "\n\n" : ""}${message}`,
    };

    // Check if email is configured
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log("Email not configured. Message received:", { name, email, phone, subject, message });
      return res.json({
        message: "Thank you for your message! We'll get back to you soon.",
        note: "Email delivery is pending configuration.",
      });
    }

    await getTransporter().sendMail(mailOptions);

    res.json({ message: "Thank you for your message! We'll get back to you soon." });
  } catch (err) {
    console.error("Contact form error:", err);
    // Still return success to the user even if email fails
    // Log the error for the admin to investigate
    res.json({
      message: "Thank you for your message! We've received it and will respond shortly.",
    });
  }
});

module.exports = router;
