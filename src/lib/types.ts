export type ClipSource =
  | "ai-animation"
  | "i2v"
  | "motion-graphic"
  | "real-footage"
  | "stock"
  | "live-action"
  | "exploded-view"
  | "other";

export type ComfyMode = "t2v" | "i2v" | "skip";

export type AspectRatio = "16:9" | "9:16" | "1:1" | "4:5";

export interface VisualSystem {
  palette: string;
  camera: string;
  subjectContinuity: string;
  avoid: string;
  grade: string;
  styleSuffix: string;
  defaultNegative: string;
}

export interface BatchDef {
  id: number;
  label: string;
}

export interface Clip {
  id: string;
  number: number;
  scriptBeat: string;
  source: ClipSource;
  shotConcept: string;
  prompt: string;
  negativePrompt: string;
  batch: number;
  durationSec: number;
  aspect: AspectRatio;
  fps: number;
  notes?: string;
  comfyMode: ComfyMode;
}

export interface Project {
  id: string;
  name: string;
  code?: string;
  tagline: string;
  aspect: AspectRatio;
  fps: number;
  durationRange: string;
  visualSystem: VisualSystem;
  batches: BatchDef[];
  clips: Clip[];
  updatedAt: string;
}

export function fullPrompt(project: Project, clip: Clip): string {
  const suffix = project.visualSystem.styleSuffix.trim();
  return suffix ? `${clip.prompt.trim()} ${suffix}` : clip.prompt.trim();
}

export function sourceLabel(source: ClipSource): string {
  switch (source) {
    case "ai-animation":
      return "AI animation";
    case "i2v":
      return "Reference I2V";
    case "motion-graphic":
      return "Motion graphic";
    case "real-footage":
      return "Real footage";
    case "stock":
      return "Stock";
    case "live-action":
      return "Live action";
    case "exploded-view":
      return "Exploded view";
    case "other":
      return "Other";
  }
}

export function blankClip(
  number: number,
  defaults: Pick<Project, "aspect" | "fps" | "visualSystem">,
): Clip {
  const id = String(number).padStart(2, "0");
  return {
    id,
    number,
    scriptBeat: "New beat",
    source: "ai-animation",
    shotConcept: "Describe the shot in one line",
    prompt: "Describe the video action, camera, and atmosphere.",
    negativePrompt: defaults.visualSystem.defaultNegative,
    batch: 1,
    durationSec: 6,
    aspect: defaults.aspect,
    fps: defaults.fps,
    comfyMode: "t2v",
  };
}

export function createBlankProject(name = "Untitled project"): Project {
  const now = new Date().toISOString();
  const visualSystem: VisualSystem = {
    palette: "define key colors",
    camera: "define camera language and pacing",
    subjectContinuity: "define what must stay consistent across clips",
    avoid: "text, watermarks, logos, morphing, low detail",
    grade: "define grade / look",
    styleSuffix:
      "Cinematic, consistent subject continuity, no text, no logos, no watermarks.",
    defaultNegative:
      "text, watermark, logo, cartoon, low detail, shaky cam, morphing geometry",
  };

  return {
    id: `proj_${Date.now().toString(36)}`,
    name,
    tagline: "Shot list + ComfyUI queue for any topic",
    aspect: "16:9",
    fps: 24,
    durationRange: "5–8s",
    visualSystem,
    batches: [
      { id: 1, label: "Hero / language" },
      { id: 2, label: "Explain" },
      { id: 3, label: "Evidence / real" },
      { id: 4, label: "Bridges / B-roll" },
    ],
    clips: [blankClip(1, { aspect: "16:9", fps: 24, visualSystem })],
    updatedAt: now,
  };
}
