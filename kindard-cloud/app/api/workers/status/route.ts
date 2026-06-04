import { NextRequest, NextResponse } from "next/server";
import { validateApiKey } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  if (!validateApiKey(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const statusRes = await db.execute("SELECT * FROM worker_status ORDER BY last_run_at DESC");
    const alertRes = await db.execute("SELECT COUNT(*) as count FROM worker_alerts WHERE is_sent = 0");
    const healthRes = await db.execute("SELECT component, status, latency_ms, created_at FROM system_health_checks ORDER BY created_at DESC LIMIT 10");

    return NextResponse.json({
      worker_status: statusRes.rows,
      pending_alerts: alertRes.rows[0].count,
      recent_health_checks: healthRes.rows,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
