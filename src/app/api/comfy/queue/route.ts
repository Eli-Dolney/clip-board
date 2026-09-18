import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";
import type { Clip } from "@/lib/types";
import {
  ComfyError,
  type ComfyPromptGraph,
  queuePrompt,
} from "@/lib/comfy/client";
import {
  createStarterT2VGraph,
  dimensionsForAspect,
  fillWorkflow,
} from "@/lib/comfy/workflow";

export const dynamic = "force-dynamic";

interface QueueBody {
  clip: Clip;
  positive: string;
  workflowFile?: string;
  seed?: number;
  clientId?: string;
  sourceImage?: string;
  checkpoint?: string;
  useStarterFallback?: boolean;
}

export async function POST(request: Request) {
  const body = (await request.json()) as QueueBody;
  const clip = body.clip;

  if (!clip?.id || !body.positive) {
    return NextResponse.json(
      { error: "clip and positive prompt are required" },
      { status: 400 },
    );
  }

  if (clip.comfyMode === "skip") {
    return NextResponse.json(
      {
        error:
          "This clip is marked skip (e.g. real-footage-only). Not queued.",
      },
      { status: 400 },
    );
  }

  let template: ComfyPromptGraph;

  if (body.workflowFile) {
    const safe = path.basename(body.workflowFile);
    if (!safe.endsWith(".json")) {
      return NextResponse.json({ error: "Invalid workflow file" }, { status: 400 });
    }
    const filePath = path.join(process.cwd(), "comfy", "workflows", safe);
    try {
      const raw = await readFile(filePath, "utf8");
      template = JSON.parse(raw) as ComfyPromptGraph;
    } catch {
      return NextResponse.json(
        { error: `Workflow not found: ${safe}` },
        { status: 404 },
      );
    }
  } else if (body.useStarterFallback) {
    template = createStarterT2VGraph(clip, body.positive);
  } else {
    return NextResponse.json(
      {
        error:
          "Provide workflowFile (API-format JSON in comfy/workflows) or useStarterFallback: true",
      },
      { status: 400 },
    );
  }

  const { width, height } = dimensionsForAspect(clip.aspect);
  const prompt = fillWorkflow(template, {
    positive: body.positive,
    negative: clip.negativePrompt,
    seed: body.seed,
    width,
    height,
    frames: Math.round(clip.durationSec * clip.fps),
    fps: clip.fps,
    sourceImage: body.sourceImage,
    checkpoint: body.checkpoint,
    filenamePrefix: `clip_${clip.id}`,
  });

  const clientId = body.clientId || `clipboard-${clip.id}`;

  try {
    const result = await queuePrompt(prompt, clientId);
    return NextResponse.json({
      ok: true,
      clipId: clip.id,
      promptId: result.prompt_id,
      number: result.number,
      nodeErrors: result.node_errors,
      clientId,
    });
  } catch (error) {
    if (error instanceof ComfyError) {
      return NextResponse.json(
        { error: error.message, body: error.body },
        { status: error.status },
      );
    }
    throw error;
  }
}
