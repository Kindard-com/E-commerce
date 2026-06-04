import { db } from "@/lib/db";
import { generateUUID } from "@/lib/hash";

export type WorkerResult = {
  success: boolean;
  message: string;
};

export async function logWorkerExecution(workerName: string, status: "success" | "failed", message: string) {
  try {
    await db.execute({
      sql: `
        INSERT INTO worker_status (worker_name, last_run_at, last_status, last_message)
        VALUES (?, CURRENT_TIMESTAMP, ?, ?)
        ON CONFLICT(worker_name) DO UPDATE SET
          last_run_at = excluded.last_run_at,
          last_status = excluded.last_status,
          last_message = excluded.last_message
      `,
      args: [workerName, status, message],
    });
  } catch (err) {
    console.error(`Failed to log execution for ${workerName}:`, err);
  }
}

export async function logWorkerDetail(workerName: string, level: "info" | "warning" | "error" | "critical", message: string, details?: any) {
  try {
    await db.execute({
      sql: `INSERT INTO worker_logs (id, worker_name, level, message, details) VALUES (?, ?, ?, ?, ?)`,
      args: [generateUUID(), workerName, level, message, details ? JSON.stringify(details) : null],
    });
  } catch (err) {
    console.error(`Failed to log detail for ${workerName}:`, err);
  }
}

export async function createWorkerAlert(workerName: string, alertType: string, message: string) {
  try {
    await db.execute({
      sql: `INSERT INTO worker_alerts (id, worker_name, alert_type, message) VALUES (?, ?, ?, ?)`,
      args: [generateUUID(), workerName, alertType, message],
    });
    // Log it as critical as well
    await logWorkerDetail(workerName, "critical", `ALERT GENERATED: ${message}`, { alertType });
  } catch (err) {
    console.error(`Failed to create alert for ${workerName}:`, err);
  }
}

export async function recordSystemHealth(component: "database" | "storage" | "api", status: "healthy" | "degraded" | "offline", latencyMs: number) {
  try {
    await db.execute({
      sql: `INSERT INTO system_health_checks (id, component, status, latency_ms) VALUES (?, ?, ?, ?)`,
      args: [generateUUID(), component, status, latencyMs],
    });
  } catch (err) {
    console.error(`Failed to record health for ${component}:`, err);
  }
}
