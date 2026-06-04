import { db } from "@/lib/db";
import { logWorkerDetail, WorkerResult } from "./index";
import nodemailer from "nodemailer";

export async function runNotificationWorker(): Promise<WorkerResult> {
  const name = "Notification Worker";

  try {
    // Fetch unsent alerts
    const res = await db.execute("SELECT id, worker_name, alert_type, message, created_at FROM worker_alerts WHERE is_sent = 0");
    
    if (res.rows.length === 0) {
      return { success: true, message: "No new alerts to send." };
    }

    const alerts = res.rows;
    let sentCount = 0;

    // Check if Email is configured
    const emailTo = process.env.ALERT_EMAIL_TO;
    const emailFrom = process.env.ALERT_EMAIL_FROM;
    const smtpHost = process.env.SMTP_HOST;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    if (emailTo && smtpHost && smtpUser && smtpPass) {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: parseInt(process.env.SMTP_PORT || "587"),
        secure: process.env.SMTP_PORT === "465",
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      const emailBody = alerts.map((a) => `[${a.alert_type.toUpperCase()}] From ${a.worker_name}: ${a.message}`).join("\\n\\n");
      
      try {
        await transporter.sendMail({
          from: emailFrom || smtpUser,
          to: emailTo,
          subject: `[Kindard CDN] ${alerts.length} New System Alerts`,
          text: `The CDN monitoring system generated the following alerts:\\n\\n${emailBody}`,
        });
        sentCount = alerts.length;
      } catch (e: any) {
        await logWorkerDetail(name, "error", `Failed to send email: ${e.message}`);
      }
    }

    // Optional Slack/Discord webhook implementation could go here
    const discordUrl = process.env.DISCORD_WEBHOOK_URL;
    if (discordUrl) {
       // ... simplified webhook sending
    }

    // Mark as sent
    for (const alert of alerts) {
      await db.execute({
        sql: "UPDATE worker_alerts SET is_sent = 1 WHERE id = ?",
        args: [alert.id as string]
      });
    }

    await logWorkerDetail(name, "info", `Processed and sent ${alerts.length} alerts.`);
    return { success: true, message: `Sent ${alerts.length} alerts.` };
  } catch (err: any) {
    return { success: false, message: err.message };
  }
}
