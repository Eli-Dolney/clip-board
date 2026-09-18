import type { ComfyPromptGraph } from "@/lib/comfy/client";
import type { Clip } from "@/lib/types";

export interface WorkflowFillOptions {
  positive: string;
  negative: string;
  seed?: number;
  width?: number;
  height?: number;
  frames?: number;
  fps?: number;
  checkpoint?: string;
  sourceImage?: string;
  filenamePrefix?: string;
}

function deepClone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function isPositiveTitle(title?: string): boolean {
  if (!title) return false;
  const t = title.toLowerCase();
  return (
    t.includes("positive") ||
    t.includes("prompt") ||
    t === "clip text encode (prompt)" ||
    t.includes("pos")
  );
}

function isNegativeTitle(title?: string): boolean {
  if (!title) return false;
  const t = title.toLowerCase();
  return t.includes("negative") || t.includes("neg");
}

/** Inject prompts into a ComfyUI API-format workflow graph. */
export function fillWorkflow(
  template: ComfyPromptGraph,
  options: WorkflowFillOptions,
): ComfyPromptGraph {
  const graph = deepClone(template);
  const positive = options.positive;
  const negative = options.negative;
  const seed =
    options.seed ?? Math.floor(Math.random() * 2_147_483_647);
  const width = options.width ?? 1280;
  const height = options.height ?? 720;
  const frames = options.frames ?? 144;
  const fps = options.fps ?? 24;

  const textNodes = Object.entries(graph).filter(
    ([, node]) =>
      node.class_type === "CLIPTextEncode" ||
      node.class_type === "CLIPTextEncodeSDXL" ||
      node.class_type.toLowerCase().includes("textencode") ||
      node.class_type.toLowerCase().includes("text_encode"),
  );

  let wrotePositive = false;
  let wroteNegative = false;

  for (const [, node] of textNodes) {
    const title = node._meta?.title;
    if (isNegativeTitle(title) && typeof node.inputs.text === "string") {
      node.inputs.text = negative;
      wroteNegative = true;
    } else if (
      (isPositiveTitle(title) || !wrotePositive) &&
      typeof node.inputs.text === "string"
    ) {
      if (!isNegativeTitle(title)) {
        node.inputs.text = positive;
        wrotePositive = true;
      }
    }
  }

  if (!wrotePositive || !wroteNegative) {
    const plain = textNodes.map(([, n]) => n);
    if (!wrotePositive && plain[0] && typeof plain[0].inputs.text === "string") {
      plain[0].inputs.text = positive;
    }
    if (!wroteNegative && plain[1] && typeof plain[1].inputs.text === "string") {
      plain[1].inputs.text = negative;
    }
  }

  for (const node of Object.values(graph)) {
    if ("seed" in node.inputs && typeof node.inputs.seed === "number") {
      node.inputs.seed = seed;
    }
    if ("noise_seed" in node.inputs && typeof node.inputs.noise_seed === "number") {
      node.inputs.noise_seed = seed;
    }
    if ("width" in node.inputs && typeof node.inputs.width === "number") {
      node.inputs.width = width;
    }
    if ("height" in node.inputs && typeof node.inputs.height === "number") {
      node.inputs.height = height;
    }
    if ("length" in node.inputs && typeof node.inputs.length === "number") {
      node.inputs.length = frames;
    }
    if ("num_frames" in node.inputs && typeof node.inputs.num_frames === "number") {
      node.inputs.num_frames = frames;
    }
    if ("frame_rate" in node.inputs && typeof node.inputs.frame_rate === "number") {
      node.inputs.frame_rate = fps;
    }
    if ("fps" in node.inputs && typeof node.inputs.fps === "number") {
      node.inputs.fps = fps;
    }
    if (
      options.checkpoint &&
      (node.class_type === "CheckpointLoaderSimple" ||
        node.class_type === "UNETLoader" ||
        node.class_type.includes("Checkpoint")) &&
      typeof node.inputs.ckpt_name === "string"
    ) {
      node.inputs.ckpt_name = options.checkpoint;
    }
    if (
      options.sourceImage &&
      (node.class_type === "LoadImage" || node.class_type === "LoadImageMask") &&
      typeof node.inputs.image === "string"
    ) {
      node.inputs.image = options.sourceImage;
    }
    if (
      options.filenamePrefix &&
      typeof node.inputs.filename_prefix === "string"
    ) {
      node.inputs.filename_prefix = options.filenamePrefix;
    }
  }

  return graph;
}

export function dimensionsForAspect(aspect: string): { width: number; height: number } {
  switch (aspect) {
    case "9:16":
      return { width: 720, height: 1280 };
    case "1:1":
      return { width: 1024, height: 1024 };
    case "4:5":
      return { width: 1080, height: 1350 };
    default:
      return { width: 1280, height: 720 };
  }
}

export function createStarterT2VGraph(
  clip: Clip,
  positive: string,
): ComfyPromptGraph {
  const { width, height } = dimensionsForAspect(clip.aspect);
  return {
    "1": {
      class_type: "CheckpointLoaderSimple",
      inputs: { ckpt_name: "REPLACE_WITH_YOUR_VIDEO_CHECKPOINT.safetensors" },
      _meta: { title: "Load Checkpoint" },
    },
    "2": {
      class_type: "CLIPTextEncode",
      inputs: { text: positive, clip: ["1", 1] },
      _meta: { title: "Positive Prompt" },
    },
    "3": {
      class_type: "CLIPTextEncode",
      inputs: { text: clip.negativePrompt, clip: ["1", 1] },
      _meta: { title: "Negative Prompt" },
    },
    "4": {
      class_type: "EmptyLatentImage",
      inputs: { width, height, batch_size: 1 },
      _meta: { title: "Latent (replace with video latent)" },
    },
    "5": {
      class_type: "KSampler",
      inputs: {
        seed: Math.floor(Math.random() * 2_147_483_647),
        steps: 20,
        cfg: 5,
        sampler_name: "euler",
        scheduler: "normal",
        denoise: 1,
        model: ["1", 0],
        positive: ["2", 0],
        negative: ["3", 0],
        latent_image: ["4", 0],
      },
      _meta: { title: "Sampler" },
    },
    "6": {
      class_type: "VAEDecode",
      inputs: { samples: ["5", 0], vae: ["1", 2] },
      _meta: { title: "VAE Decode" },
    },
    "7": {
      class_type: "SaveImage",
      inputs: {
        filename_prefix: `clip_${clip.id}`,
        images: ["6", 0],
      },
      _meta: { title: "Save (swap for SaveVideo / VHS_VideoCombine)" },
    },
  };
}
