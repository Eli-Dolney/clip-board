import type { Project } from "@/lib/types";
import { PROJECT_TEMPLATES } from "@/lib/templates";

const STORAGE_KEY = "clipboard.projects.v1";
const ACTIVE_KEY = "clipboard.activeProjectId.v1";

export function loadProjects(): Project[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Project[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveProjects(projects: Project[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}

export function getActiveProjectId(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(ACTIVE_KEY);
}

export function setActiveProjectId(id: string) {
  window.localStorage.setItem(ACTIVE_KEY, id);
}

/** Bootstrap: if nothing saved, seed with blank + keep Fury available via templates. */
export function ensureProjects(): { projects: Project[]; activeId: string } {
  let projects = loadProjects();
  if (projects.length === 0) {
    const starter = PROJECT_TEMPLATES.find((t) => t.id === "blank")!.build();
    starter.name = "My first project";
    projects = [starter];
    saveProjects(projects);
    setActiveProjectId(starter.id);
    return { projects, activeId: starter.id };
  }
  const activeId = getActiveProjectId() || projects[0].id;
  if (!projects.some((p) => p.id === activeId)) {
    setActiveProjectId(projects[0].id);
    return { projects, activeId: projects[0].id };
  }
  return { projects, activeId };
}

export function upsertProject(project: Project, projects: Project[]): Project[] {
  const next = [...projects];
  const idx = next.findIndex((p) => p.id === project.id);
  const stamped = { ...project, updatedAt: new Date().toISOString() };
  if (idx >= 0) next[idx] = stamped;
  else next.unshift(stamped);
  saveProjects(next);
  return next;
}

export function deleteProject(id: string, projects: Project[]): Project[] {
  const next = projects.filter((p) => p.id !== id);
  saveProjects(next);
  return next;
}

export function exportProjectJson(project: Project): string {
  return JSON.stringify(project, null, 2);
}

export function importProjectJson(raw: string): Project {
  const parsed = JSON.parse(raw) as Project;
  if (!parsed?.name || !Array.isArray(parsed.clips) || !parsed.visualSystem) {
    throw new Error("Invalid project JSON");
  }
  return {
    ...parsed,
    id: `proj_${Date.now().toString(36)}`,
    updatedAt: new Date().toISOString(),
  };
}
