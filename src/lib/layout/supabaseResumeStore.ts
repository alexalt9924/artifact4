// ResumeStore backed by Supabase through the server actions in src/app/resume/actions.ts.

import type { Resume } from "@/types/resume";
import { deleteResume, listResumes, saveResume } from "@/app/resume/actions";
import type { ResumeStore } from "./resumeStore";

// Saves for one resume run one at a time, and only the newest pending version is sent.
// This keeps rapid edits (typing a name, several drops) from arriving out of order or piling up.
const pending = new Map<string, Resume>();
const inFlight = new Map<string, Promise<void>>();

async function drain(id: string): Promise<void> {
  try {
    for (let next = pending.get(id); next; next = pending.get(id)) {
      pending.delete(id);
      await saveResume(next);
    }
  } finally {
    inFlight.delete(id);
  }
}

export const supabaseResumeStore: ResumeStore = {
  // RLS decides whose resumes come back, so `userId` isn't sent.
  list: () => listResumes(),
  save(resume) {
    pending.set(resume.id, resume);
    const running = inFlight.get(resume.id);
    if (running) return running;
    const started = drain(resume.id);
    inFlight.set(resume.id, started);
    return started;
  },
  async remove(id) {
    pending.delete(id);
    await inFlight.get(id)?.catch(() => {});
    await deleteResume(id);
  },
};
