const nodemailer = require("nodemailer");

let transporter;

function getTransporter() {
  if (transporter) {
    return transporter;
  }
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) {
    transporter = null;
    return null;
  }
  transporter = nodemailer.createTransport({
    host,
    port,
    auth: {
      user,
      pass,
    },
  });
  return transporter;
}

async function sendMail(to, subject, text) {
  const mailFrom = process.env.MAIL_FROM || process.env.SMTP_USER || "";
  const t = getTransporter();
  if (!t || !mailFrom) {
    console.log("Email send skipped", { to, subject, text });
    return;
  }
  await t.sendMail({
    from: mailFrom,
    to,
    subject,
    text,
  });
}

async function sendVerificationOtpEmail(email, code) {
  const subject = "Verify your email";
  const text = "Your verification code is " + code;
  await sendMail(email, subject, text);
}

async function sendResetOtpEmail(email, code) {
  const subject = "Reset password code";
  const text = "Your password reset code is " + code;
  await sendMail(email, subject, text);
}

async function sendApplicationStatusEmail(email, jobTitle, status) {
  const subject = "Application status updated";
  const text =
    "Your application for job \"" +
    jobTitle +
    "\" is now \"" +
    status +
    "\"";
  await sendMail(email, subject, text);
}

module.exports = {
  sendVerificationOtpEmail,
  sendResetOtpEmail,
  sendApplicationStatusEmail,
};

