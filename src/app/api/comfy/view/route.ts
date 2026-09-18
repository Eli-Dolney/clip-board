import { ComfyError, viewImage } from "@/lib/comfy/client";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get("filename");
  if (!filename) {
    return new Response("filename required", { status: 400 });
  }

  try {
    const upstream = await viewImage({
      filename,
      subfolder: searchParams.get("subfolder") || "",
      type: searchParams.get("type") || "output",
    });
    const contentType = upstream.headers.get("content-type") || "application/octet-stream";
    const buffer = await upstream.arrayBuffer();
    return new Response(buffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    if (error instanceof ComfyError) {
      return new Response(error.message, { status: error.status });
    }
    throw error;
  }
}
