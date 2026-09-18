import { NextResponse } from "next/server";
import { readdir, readFile } from "fs/promises";
import path from "path";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get("name");
  const dir = path.join(process.cwd(), "comfy", "workflows");

  if (!name) {
    const files = await readdir(dir);
    return NextResponse.json({
      workflows: files.filter((f) => f.endsWith(".json")),
    });
  }

  const safe = path.basename(name);
  if (!safe.endsWith(".json")) {
    return NextResponse.json({ error: "Invalid name" }, { status: 400 });
  }

  try {
    const raw = await readFile(path.join(dir, safe), "utf8");
    return NextResponse.json({ name: safe, workflow: JSON.parse(raw) });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
