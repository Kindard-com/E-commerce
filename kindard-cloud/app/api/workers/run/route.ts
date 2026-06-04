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

export async function POST(request: NextRequest) {
  if (!validateApiKey(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const results: Record<string, any> = {};

  // Run all workers concurrently
  const promises = Object.entries(workers).map(async ([name, fn]) => {
    try {
      const result = await fn();
      await logWorkerExecution(name, result.success ? "success" : "failed", result.message);
      results[name] = result;
    } catch (err: any) {
      await logWorkerExecution(name, "failed", err.message);
      results[name] = { success: false, message: err.message };
    }
  });

  await Promise.all(promises);

  return NextResponse.json({ message: "All workers executed", results });
}
