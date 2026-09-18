import type { Project } from "@/lib/types";
import { createBlankProject } from "@/lib/types";

const FURY_NEGATIVE =
  "text, watermark, logo, flag, insignia, cockpit interior of Fury, extra wings, morphing geometry, duplicated aircraft, cartoon, low detail, shaky cam, explosion, muzzle flash, readable UI numbers";

const FURY_STYLE =
  "Cinematic aerospace documentary, 16:9, 24fps pacing. Graphite black, cool steel, restrained warm amber accents. Fury continuity: long pointed nose, swept wings, single vertical tail, matte dark-gray finish, no cockpit. Physically plausible aircraft motion, long-lens compression, no text, no logos, no flags, no fictional insignia.";

export const PROJECT_TEMPLATES: Array<{
  id: string;
  label: string;
  description: string;
  build: () => Project;
}> = [
  {
    id: "blank",
    label: "Blank project",
    description: "Empty shot list — any topic, any look",
    build: () => createBlankProject("Untitled project"),
  },
  {
    id: "product",
    label: "Product / launch",
    description: "Hero product shots, features, lifestyle bridges",
    build: () => {
      const p = createBlankProject("Product launch");
      p.tagline = "Hero, feature, and lifestyle clips for a product story";
      p.visualSystem = {
        palette: "define brand colors",
        camera: "clean commercial camera; slow push-ins, locked macros",
        subjectContinuity: "same product silhouette, materials, and logo placement rules",
        avoid: "readable fake UI, misshapen product, extra logos, text overlays",
        grade: "clean commercial grade",
        styleSuffix:
          "Premium product commercial, consistent product identity, no text, no watermarks.",
        defaultNegative:
          "text, watermark, logo clutter, deformed product, extra fingers, low detail",
      };
      p.batches = [
        { id: 1, label: "Hero" },
        { id: 2, label: "Features" },
        { id: 3, label: "Proof / demos" },
        { id: 4, label: "Lifestyle bridges" },
      ];
      p.clips = [
        {
          id: "01",
          number: 1,
          scriptBeat: "Cold open: product in world",
          source: "ai-animation",
          shotConcept: "Atmospheric wide that introduces the product without hard sell",
          prompt:
            "Wide cinematic establishing shot introducing the product in its natural environment. Slow deliberate camera, premium commercial lighting, no text.",
          negativePrompt: p.visualSystem.defaultNegative,
          batch: 1,
          durationSec: 6,
          aspect: "16:9",
          fps: 24,
          comfyMode: "t2v",
        },
        {
          id: "02",
          number: 2,
          scriptBeat: "Hard product reveal",
          source: "i2v",
          shotConcept: "Reference-led hero orbit or push-in",
          prompt:
            "Preserve the supplied product reference. Slow stabilized hero move revealing materials and silhouette. Premium commercial realism.",
          negativePrompt: p.visualSystem.defaultNegative,
          batch: 1,
          durationSec: 6,
          aspect: "16:9",
          fps: 24,
          notes: "Use an approved still for I2V.",
          comfyMode: "i2v",
        },
        {
          id: "03",
          number: 3,
          scriptBeat: "Key feature moment",
          source: "ai-animation",
          shotConcept: "One clear feature communicated through motion",
          prompt:
            "Tight documentary insert showing one product feature through clear physical motion. Leave negative space for post labels. No generated text.",
          negativePrompt: p.visualSystem.defaultNegative,
          batch: 2,
          durationSec: 5,
          aspect: "16:9",
          fps: 24,
          comfyMode: "t2v",
        },
      ];
      return p;
    },
  },
  {
    id: "narrative",
    label: "Narrative / short film",
    description: "Story beats with continuity and bridges",
    build: () => {
      const p = createBlankProject("Narrative short");
      p.tagline = "Story beats, coverage, and atmospheric bridges";
      p.visualSystem = {
        palette: "define mood palette",
        camera: "motivated camera; coverage + inserts",
        subjectContinuity: "same characters, wardrobe, and location language",
        avoid: "identity drift, costume changes mid-scene, text, logos",
        grade: "cinematic narrative grade",
        styleSuffix:
          "Cinematic narrative short, consistent characters and locations, no text, no logos.",
        defaultNegative:
          "text, watermark, logo, identity drift, extra limbs, low detail, morphing faces",
      };
      p.batches = [
        { id: 1, label: "Story pillars" },
        { id: 2, label: "Coverage" },
        { id: 3, label: "Practical / real" },
        { id: 4, label: "Atmosphere" },
      ];
      p.clips = [
        {
          id: "01",
          number: 1,
          scriptBeat: "Opening image",
          source: "ai-animation",
          shotConcept: "Tone-setting wide before dialogue",
          prompt:
            "Opening wide establishing the world and mood. Slow camera, naturalistic light, no text.",
          negativePrompt: p.visualSystem.defaultNegative,
          batch: 1,
          durationSec: 6,
          aspect: "16:9",
          fps: 24,
          comfyMode: "t2v",
        },
        {
          id: "02",
          number: 2,
          scriptBeat: "Character introduction",
          source: "ai-animation",
          shotConcept: "Clear read of the protagonist",
          prompt:
            "Medium shot introducing the main character with consistent wardrobe and face. Motivated camera, cinematic lighting, no text.",
          negativePrompt: p.visualSystem.defaultNegative,
          batch: 1,
          durationSec: 6,
          aspect: "16:9",
          fps: 24,
          comfyMode: "t2v",
        },
      ];
      return p;
    },
  },
  {
    id: "social",
    label: "Social / vertical",
    description: "9:16 hooks, demos, CTAs (labels in edit)",
    build: () => {
      const p = createBlankProject("Social vertical");
      p.tagline = "Hook → demo → payoff for short-form";
      p.aspect = "9:16";
      p.fps = 30;
      p.durationRange = "3–8s";
      p.visualSystem = {
        palette: "define brand / mood colors",
        camera: "punchy vertical framing; fast readable motion",
        subjectContinuity: "same subject identity across hooks",
        avoid: "generated captions, watermarks, unreadable faces",
        grade: "punchy social grade",
        styleSuffix:
          "Vertical 9:16 social clip, punchy readable motion, no on-screen text, no watermarks.",
        defaultNegative:
          "text, captions, watermark, logo, low detail, cropped faces, morphing",
      };
      p.batches = [
        { id: 1, label: "Hooks" },
        { id: 2, label: "Demo" },
        { id: 3, label: "Proof" },
        { id: 4, label: "Payoff / loop" },
      ];
      p.clips = [
        {
          id: "01",
          number: 1,
          scriptBeat: "Hook in first second",
          source: "ai-animation",
          shotConcept: "Immediate visual question or surprise",
          prompt:
            "Vertical 9:16 hook shot with an immediate visual surprise. Subject fills frame, motion starts instantly, no text.",
          negativePrompt: p.visualSystem.defaultNegative,
          batch: 1,
          durationSec: 4,
          aspect: "9:16",
          fps: 30,
          comfyMode: "t2v",
        },
      ];
      return stamp(p);
    },
  },
  {
    id: "fury",
    label: "FQ-44 Fury (sample)",
    description: "The original aerospace b-roll plan as a template",
    build: () => furyProject(),
  },
];

function stamp(p: Project): Project {
  p.updatedAt = new Date().toISOString();
  return p;
}

function furyProject(): Project {
  const visualSystem = {
    palette: "graphite black · cool steel · restrained warm amber",
    camera:
      "premium aerospace documentary; deliberate motion, long-lens compression, physically plausible aircraft movement",
    subjectContinuity:
      "Fury: long pointed nose, swept wings, single vertical tail, matte dark-gray finish, no cockpit",
    avoid:
      "generated text, logos, flags, fictional insignia, invented weapons, cockpit views inside Fury, morphing geometry, extra wings, duplicated aircraft, explosions unless script calls for combat",
    grade:
      "slightly cool shadows, neutral highlights, restrained amber practicals",
    styleSuffix: FURY_STYLE,
    defaultNegative: FURY_NEGATIVE,
  };

  return stamp({
    id: `proj_fury_${Date.now().toString(36)}`,
    name: "Fury",
    code: "FQ-44",
    tagline:
      "B-roll clip board for local ComfyUI — 16:9, 24 fps, 5–8s",
    aspect: "16:9",
    fps: 24,
    durationRange: "5–8s",
    visualSystem,
    batches: [
      { id: 1, label: "Aircraft language" },
      { id: 2, label: "Explanatory" },
      { id: 3, label: "Real evidence" },
      { id: 4, label: "Environmental bridges" },
    ],
    clips: [
      {
        id: "01",
        number: 1,
        scriptBeat: "Cold open: defended airspace",
        source: "ai-animation",
        shotConcept:
          "Moonless cloud deck, distant radar sweeps, brief F-35 silhouette, no engagement",
        prompt:
          "Night aerial documentary shot above storm clouds. A distant crewed stealth fighter crosses frame while faint ground radar beams search below. Restrained, tense, physically plausible, no combat, no text.",
        negativePrompt: FURY_NEGATIVE,
        batch: 4,
        durationSec: 6,
        aspect: "16:9",
        fps: 24,
        comfyMode: "t2v",
      },
      {
        id: "02",
        number: 2,
        scriptBeat: "Four Fury aircraft ahead",
        source: "ai-animation",
        shotConcept:
          "Rear-quarter formation reveal; one F-35 behind four small unmanned jets",
        prompt:
          "One continuous rear-quarter tracking shot of a single F-35 following four smaller cockpitless Fury aircraft through moonlit haze. Stable formation, realistic spacing and flight physics, subtle navigation lights, no weapons firing.",
        negativePrompt: FURY_NEGATIVE,
        batch: 1,
        durationSec: 7,
        aspect: "16:9",
        fps: 24,
        comfyMode: "t2v",
      },
      {
        id: "03",
        number: 3,
        scriptBeat: "Hard reveal",
        source: "i2v",
        shotConcept: "Slow side-profile hero pass",
        prompt:
          "Preserve the exact supplied Fury reference. Slow stabilized camera drift along the aircraft from nose to tail at golden hour, landing gear visible, subtle heat haze, premium aerospace commercial realism.",
        negativePrompt: FURY_NEGATIVE,
        batch: 1,
        durationSec: 6,
        aspect: "16:9",
        fps: 24,
        notes: "Requires approved Fury still as I2V source.",
        comfyMode: "i2v",
      },
      {
        id: "08",
        number: 8,
        scriptBeat: "Give the F-35 a pack",
        source: "ai-animation",
        shotConcept: "Wide formation expands across miles",
        prompt:
          "Very wide aerial shot. One F-35 remains central while four smaller Fury aircraft peel into forward sensor, escort, and flanking positions across a huge sky. Smooth readable geometry, no dogfight.",
        negativePrompt: FURY_NEGATIVE,
        batch: 1,
        durationSec: 7,
        aspect: "16:9",
        fps: 24,
        comfyMode: "t2v",
      },
      {
        id: "13",
        number: 13,
        scriptBeat: "One becomes many",
        source: "ai-animation",
        shotConcept:
          "Single runway aircraft match-cuts to 10, then 50 silhouettes",
        prompt:
          "Locked elevated runway shot at dawn. One Fury sits centered; successive match cuts reveal orderly rows expanding deep into the frame. Consistent aircraft geometry, no teleport shimmer, no text.",
        negativePrompt: FURY_NEGATIVE,
        batch: 1,
        durationSec: 7,
        aspect: "16:9",
        fps: 24,
        comfyMode: "t2v",
      },
      {
        id: "16",
        number: 16,
        scriptBeat: "Ending: one pilot, a pack",
        source: "ai-animation",
        shotConcept: "Long-lens sunset formation, one Fury peels toward horizon",
        prompt:
          "Majestic long-lens sunset shot: one F-35 and four Fury aircraft fly in disciplined formation above clouds. Camera holds steady as one Fury smoothly peels toward the horizon. Hopeful, realistic, no weapons, no text.",
        negativePrompt: FURY_NEGATIVE,
        batch: 1,
        durationSec: 8,
        aspect: "16:9",
        fps: 24,
        comfyMode: "t2v",
      },
      {
        id: "11",
        number: 11,
        scriptBeat: "Missile authorization and release",
        source: "real-footage",
        shotConcept: "Hold on real release; no narration",
        prompt:
          "Atmosphere only — do not generate the proof release moment.",
        negativePrompt: FURY_NEGATIVE,
        batch: 3,
        durationSec: 5,
        aspect: "16:9",
        fps: 24,
        notes: "Real footage only for the factual claim.",
        comfyMode: "skip",
      },
    ],
    updatedAt: new Date().toISOString(),
  });
}

export function templateById(id: string) {
  return PROJECT_TEMPLATES.find((t) => t.id === id);
}
