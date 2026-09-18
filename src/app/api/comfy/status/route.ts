import { NextResponse } from "next/server";
import {
  ComfyError,
  getComfyBaseUrl,
  getQueue,
  getSystemStats,
} from "@/lib/comfy/client";
import { readdir } from "fs/promises";
import path from "path";

export const dynamic = "force-dynamic";

export async function GET() {
  const baseUrl = getComfyBaseUrl();

  let workflows: string[] = [];
  try {
    const dir = path.join(process.cwd(), "comfy", "workflows");
    const files = await readdir(dir);
    workflows = files.filter((f) => f.endsWith(".json"));
  } catch {
    workflows = [];
  }

  try {
    const [stats, queue] = await Promise.all([getSystemStats(), getQueue()]);
    return NextResponse.json({
      ok: true,
      baseUrl,
      stats,
      queue,
      workflows,
    });
  } catch (error) {
    if (error instanceof ComfyError) {
      return NextResponse.json(
        {
          ok: false,
          baseUrl,
          error: error.message,
          workflows,
        },
        { status: 503 },
      );
    }
    throw error;
  }
}
