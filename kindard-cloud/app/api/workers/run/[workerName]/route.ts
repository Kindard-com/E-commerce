import { NextRequest, NextResponse } from "next/server";
import { validateApiKey } from "@/lib/auth";
import { logWorkerExecution } from "@/lib/workers";
import {
  runImageDeliveryWorker,
  runDatabaseHealthWorker,
  runStorageHealthWorker,
  runDomainValidationWorker,
  runHotlinkWorker,
  runRateLimitWorker,
  runCachePerformanceWorker,
  runApiSecurityWorker,
} from "@/lib/workers/tasks";
import { runAiErrorAnalysisWorker } from "@/lib/workers/ai-worker";
import { runNotificationWorker } from "@/lib/workers/notification-worker";

const workers: Record<string, () => Promise<{ success: boolean; message: string }>> = {
  "ImageDeliveryWorker": runImageDeliveryWorker,
  "DatabaseHealthWorker": runDatabaseHealthWorker,
  "StorageHealthWorker": runStorageHealthWorker,
  "DomainValidationWorker": runDomainValidationWorker,
  "HotlinkProtectionWorker": runHotlinkWorker,
  "RateLimitWorker": runRateLimitWorker,
  "CachePerformanceWorker": runCachePerformanceWorker,
  "ApiSecurityWorker": runApiSecurityWorker,
  "AiErrorAnalysisWorker": runAiErrorAnalysisWorker,
  "NotificationWorker": runNotificationWorker,
};

export async function POST(request: NextRequest, { params }: { params: Promise<{ workerName: string }> }) {
  if (!validateApiKey(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { workerName } = await params;
  const fn = workers[workerName];

  if (!fn) {
    return NextResponse.json({ error: "Worker not found", availableWorkers: Object.keys(workers) }, { status: 404 });
  }

  try {
    const result = await fn();
    await logWorkerExecution(workerName, result.success ? "success" : "failed", result.message);
    return NextResponse.json({ worker: workerName, result });
  } catch (err: any) {
    await logWorkerExecution(workerName, "failed", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
