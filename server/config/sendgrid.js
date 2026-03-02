import sgMail from "@sendgrid/mail";

const hasSendgridApiKey = Boolean(process.env.SENDGRID_API_KEY);
if (hasSendgridApiKey) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

export async function sendEmail({ to, subject, text, html }) {
  if (!process.env.EMAIL_FROM) {
    throw new Error("EMAIL_FROM is required to send email");
  }

  if (!hasSendgridApiKey) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("SENDGRID_API_KEY is required in production");
    }

    console.log(`[DEV EMAIL] To: ${to} | Subject: ${subject}`);
    console.log(text || html || "");
    return { mocked: true };
  }

  const msg = {
    to,
    from: process.env.EMAIL_FROM, // must be a verified sender in SendGrid
    subject,
    text,
    html,
  };

  return sgMail.send(msg);
}
