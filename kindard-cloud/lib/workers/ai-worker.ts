import { db } from "@/lib/db";
import { logWorkerDetail, WorkerResult } from "./index";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function runAiErrorAnalysisWorker(): Promise<WorkerResult> {
  const name = "AI Error Analysis Worker";
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return { success: false, message: "GEMINI_API_KEY is not set." };
  }

  try {
    // Get recent errors and warnings
    const res = await db.execute("SELECT worker_name, level, message, details, created_at FROM worker_logs WHERE level IN ('warning', 'error', 'critical') AND created_at >= datetime('now', '-24 hour') LIMIT 50");
    
    if (res.rows.length === 0) {
      await logWorkerDetail(name, "info", "No errors to analyze in the last 24 hours.");
      return { success: true, message: "No errors to analyze." };
    }

    const logsJson = JSON.stringify(res.rows, null, 2);
    
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      You are an expert DevOps AI monitoring a CDN. Analyze these recent error logs.
      Classify the overall system health risk as: low, medium, high, or critical.
      Generate a short human-readable report summarizing what is wrong and suggest possible fixes.
      
      Logs:
      ${logsJson}
      
      Output format strictly as JSON:
      {
        "risk_level": "...",
        "summary": "...",
        "recommendations": ["..."]
      }
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    // Parse the JSON block from the response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const analysis = JSON.parse(jsonMatch[0]);
      await logWorkerDetail(name, "info", "AI Analysis Complete", analysis);
      return { success: true, message: `Risk: ${analysis.risk_level}. ${res.rows.length} logs analyzed.` };
    }

    return { success: false, message: "Failed to parse AI response." };
  } catch (err: any) {
    await logWorkerDetail(name, "error", `AI analysis failed: ${err.message}`);
    return { success: false, message: err.message };
  }
}
