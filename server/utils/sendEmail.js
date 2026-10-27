const { Resend } = require("resend");

const subjects = {
  verify: "Your ArtMind code",
  reset: "Reset your ArtMind password"
};

const intros = {
  verify: "Here is the code to confirm your email. It works for ten minutes.",
  reset: "Here is the code to reset your password. It works for ten minutes."
};

function makeHtml(code, reason) {
  return (
    "<div style=\"font-family: Georgia, serif; color: #1c1b19; padding: 24px;\">" +
    "<h1 style=\"font-weight: normal; font-size: 28px;\">ArtMind</h1>" +
    "<p style=\"font-size: 16px;\">" + intros[reason] + "</p>" +
    "<p style=\"font-size: 40px; letter-spacing: 8px; margin: 24px 0;\">" + code + "</p>" +
    "<p style=\"font-size: 14px; color: #5f5a51;\">If you did not ask for this, you can ignore this email.</p>" +
    "</div>"
  );
}

async function sendCode(email, code, reason) {
  const kind = reason === "reset" ? "reset" : "verify";
  if (!process.env.MAIL_API_KEY) {
    console.log("Code for " + email + ": " + code);
    return;
  }
  try {
    const resend = new Resend(process.env.MAIL_API_KEY);
    const result = await resend.emails.send({
      from: process.env.MAIL_FROM,
      to: email,
      subject: subjects[kind],
      html: makeHtml(code, kind)
    });
    if (result && result.error) {
      throw new Error(result.error.message || "The email service said no");
    }
  } catch (error) {
    console.log("Could not send the email: " + error.message);
    console.log("Code for " + email + ": " + code);
  }
}

module.exports = { sendCode };
