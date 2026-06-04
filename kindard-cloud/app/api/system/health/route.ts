import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const res = await db.execute("SELECT component, status FROM system_health_checks ORDER BY created_at DESC LIMIT 3");
    
    // Group by component to get the latest status of each
    const healthMap: Record<string, string> = {};
    for (const row of res.rows) {
      const comp = row.component as string;
      if (!healthMap[comp]) {
        healthMap[comp] = row.status as string;
      }
    }

    const allHealthy = Object.values(healthMap).every(s => s === "healthy" || s === "operational");

    return NextResponse.json({
      status: allHealthy ? "operational" : "degraded",
      components: healthMap,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    return NextResponse.json({
      status: "offline",
      error: "Unable to determine system health",
      timestamp: new Date().toISOString()
    }, { status: 503 });
  }
}
