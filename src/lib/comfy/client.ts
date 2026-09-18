export function getComfyBaseUrl(): string {
  return (
    process.env.COMFYUI_URL?.replace(/\/$/, "") || "http://127.0.0.1:8188"
  );
}

export class ComfyError extends Error {
  status: number;
  body: string;

  constructor(message: string, status: number, body: string) {
    super(message);
    this.name = "ComfyError";
    this.status = status;
    this.body = body;
  }
}

async function comfyFetch(path: string, init?: RequestInit): Promise<Response> {
  const base = getComfyBaseUrl();
  const url = `${base}${path.startsWith("/") ? path : `/${path}`}`;

  let response: Response;
  try {
    response = await fetch(url, {
      ...init,
      cache: "no-store",
      headers: {
        ...(init?.headers || {}),
      },
    });
  } catch (error) {
    const detail = error instanceof Error ? error.message : "unknown error";
    throw new ComfyError(
      `Cannot reach ComfyUI at ${base}. Is it running on your 4080? (${detail})`,
      503,
      detail,
    );
  }

  return response;
}

export async function getSystemStats() {
  const res = await comfyFetch("/system_stats");
  if (!res.ok) {
    throw new ComfyError("Failed to read system_stats", res.status, await res.text());
  }
  return res.json();
}

export async function getQueue() {
  const res = await comfyFetch("/queue");
  if (!res.ok) {
    throw new ComfyError("Failed to read queue", res.status, await res.text());
  }
  return res.json();
}

export async function getHistory(promptId?: string) {
  const path = promptId ? `/history/${promptId}` : "/history";
  const res = await comfyFetch(path);
  if (!res.ok) {
    throw new ComfyError("Failed to read history", res.status, await res.text());
  }
  return res.json();
}

export async function listObjectInfo() {
  const res = await comfyFetch("/object_info");
  if (!res.ok) {
    throw new ComfyError("Failed to read object_info", res.status, await res.text());
  }
  return res.json();
}

export async function uploadImage(
  file: Blob,
  filename: string,
  overwrite = true,
) {
  const form = new FormData();
  form.append("image", file, filename);
  form.append("overwrite", overwrite ? "true" : "false");

  const res = await comfyFetch("/upload/image", {
    method: "POST",
    body: form,
  });

  if (!res.ok) {
    throw new ComfyError("Failed to upload image", res.status, await res.text());
  }
  return res.json();
}

export type ComfyPromptGraph = Record<
  string,
  {
    class_type: string;
    inputs: Record<string, unknown>;
    _meta?: { title?: string };
  }
>;

export async function queuePrompt(
  prompt: ComfyPromptGraph,
  clientId: string,
) {
  const res = await comfyFetch("/prompt", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, client_id: clientId }),
  });

  const text = await res.text();
  if (!res.ok) {
    throw new ComfyError("Failed to queue prompt", res.status, text);
  }

  return JSON.parse(text) as {
    prompt_id: string;
    number: number;
    node_errors?: Record<string, unknown>;
  };
}

export async function viewImage(params: {
  filename: string;
  subfolder?: string;
  type?: string;
}) {
  const search = new URLSearchParams({
    filename: params.filename,
    subfolder: params.subfolder || "",
    type: params.type || "output",
  });
  const res = await comfyFetch(`/view?${search.toString()}`);
  if (!res.ok) {
    throw new ComfyError("Failed to view output", res.status, await res.text());
  }
  return res;
}

export async function interruptQueue() {
  const res = await comfyFetch("/interrupt", { method: "POST" });
  if (!res.ok) {
    throw new ComfyError("Failed to interrupt", res.status, await res.text());
  }
  return { ok: true };
}
