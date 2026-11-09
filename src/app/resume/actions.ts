"use server";

import { createClient } from "@/lib/db/server";
import { normalizeSections } from "@/lib/layout/resumeOps";
import type { Resume } from "@/types/resume";

// Resume storage in Supabase. RLS on `resumes` scopes every query to the logged-in user,
// and user_id defaults to auth.uid(), so the client never chooses whose row it writes.

interface ResumeRow {
  id: string;
  user_id: string;
  name: string;
  sections: Partial<Resume["sections"]> | null;
  updated_at: string;
}

const resumeFromRow = (r: ResumeRow): Resume => ({
  id: r.id,
  userId: r.user_id,
  name: r.name,
  sections: normalizeSections(r.sections ?? undefined),
  updatedAt: r.updated_at,
});

/** Returns null when the user has no resumes yet, so the page can seed a first one. */
export async function listResumes(): Promise<Resume[] | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("resumes").select("*").order("updated_at", { ascending: true });
  if (error) throw new Error(error.message);
  const rows = data as ResumeRow[];
  return rows.length === 0 ? null : rows.map(resumeFromRow);
}

/** Creates or updates a resume. `resume.userId` is ignored; the row always belongs to the caller. */
export async function saveResume(resume: Resume): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("resumes").upsert({
    id: resume.id,
    name: String(resume.name),
    sections: normalizeSections(resume.sections),
    updated_at: new Date().toISOString(),
  });
  if (error) throw new Error(error.message);
}

export async function deleteResume(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("resumes").delete().eq("id", id);
  if (error) throw new Error(error.message);
}
