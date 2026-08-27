import nodemailer from 'nodemailer';

interface SendMailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendMail({ to, subject, html, text }: SendMailOptions) {
  try {
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
      throw new Error('SMTP_HOST, SMTP_USER, and SMTP_PASS must be set')
    }

    // Note: Do not hardcode SMTP credentials here.
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587', 10),
      secure: process.env.SMTP_SECURE === 'true', // true for 465, false for 587 (STARTTLS)
      requireTLS: process.env.SMTP_SECURE !== 'true', // Private Email expects STARTTLS on 587
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: process.env.MAIL_FROM || '"Kindard Orders" <orders@kindard.com>',
      replyTo: process.env.MAIL_REPLY_TO || 'orders@kindard.com',
      to,
      subject,
      html,
      text: text || "Please view this email in an HTML compatible email client.",
    });

    console.log(`[Email] Successfully sent email to ${to} (Message ID: ${info.messageId})`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    // Log the error securely without exposing the password
    console.error(`[Email] Failed to send email to ${to}:`, error instanceof Error ? error.message : error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown email error' };
  }
}
