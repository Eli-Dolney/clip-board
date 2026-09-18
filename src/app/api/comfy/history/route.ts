import { NextResponse } from "next/server";
import { ComfyError, getHistory } from "@/lib/comfy/client";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const promptId = searchParams.get("promptId") || undefined;

  try {
    const history = await getHistory(promptId);
    return NextResponse.json({ ok: true, history });
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
