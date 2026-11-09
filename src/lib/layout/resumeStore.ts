// Storage for resumes behind a small async interface.
// The app uses supabaseResumeStore; this localStorage store is kept for working offline without Supabase.

import type { Resume } from "@/types/resume";
import { normalizeSections } from "./resumeOps";

export interface ResumeStore {
  /** Returns null when nothing has ever been saved for this user (used to seed a first resume). */
  list(userId: string): Promise<Resume[] | null>;
  save(resume: Resume): Promise<void>;
  remove(id: string): Promise<void>;
}

const STORAGE_KEY = "resume-builder:resumes:v1";

function readAll(): Resume[] | null {
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (raw === null) return null;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return (parsed as Resume[]).map((r) => ({ ...r, sections: normalizeSections(r.sections) }));
  } catch {
    return [];
  }
}

function writeAll(resumes: Resume[]): void {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(resumes));
}

export const localResumeStore: ResumeStore = {
  async list(userId) {
    const all = readAll();
    if (all === null) return null;
    return all.filter((r) => r.userId === userId);
  },
  async save(resume) {
    const all = readAll() ?? [];
    const index = all.findIndex((r) => r.id === resume.id);
    if (index === -1) all.push(resume);
    else all[index] = resume;
    writeAll(all);
  },
  async remove(id) {
    writeAll((readAll() ?? []).filter((r) => r.id !== id));
  },
};
