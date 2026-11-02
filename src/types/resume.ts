// Shared data model. Mirrors PLAN.md section 7.
// Do not change without both teammates agreeing (see CLAUDE.md).

export type EntryType = "project" | "experience" | "education" | "skills";

export interface Entry {
  id: string;
  userId: string;
  type: EntryType;
  title: string; // "Resume Builder" or "Software Intern"
  subtitle?: string; // "Acme Corp" or "Next.js, Supabase"
  location?: string;
  startDate?: string; // "2025-06"
  endDate?: string; // "2025-09" or "Present"
  bullets: string[];
  updatedAt: string;
}

export interface Template {
  userId: string;
  header: { name: string; email?: string; phone?: string; links: string[] };
  sectionOrder: EntryType[];
  style: { fontFamily: string; fontSizePt: number; marginIn: number };
  pageSize: "letter" | "a4";
}

export interface Resume {
  id: string;
  userId: string;
  name: string; // "SWE Internship"
  sections: Record<EntryType, string[]>; // ordered Entry ids per section
  updatedAt: string;
}
