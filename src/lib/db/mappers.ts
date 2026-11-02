import type { Entry, EntryType, Template } from "@/types/resume";

// Database rows use snake_case; the shared types use camelCase.
export interface EntryRow {
  id: string;
  user_id: string;
  type: EntryType;
  title: string;
  subtitle: string | null;
  location: string | null;
  start_date: string | null;
  end_date: string | null;
  bullets: string[];
  updated_at: string;
}

export interface TemplateRow {
  user_id: string;
  header: Template["header"];
  section_order: EntryType[];
  style: Template["style"];
  page_size: Template["pageSize"];
}

export const entryFromRow = (r: EntryRow): Entry => ({
  id: r.id,
  userId: r.user_id,
  type: r.type,
  title: r.title,
  subtitle: r.subtitle ?? undefined,
  location: r.location ?? undefined,
  startDate: r.start_date ?? undefined,
  endDate: r.end_date ?? undefined,
  bullets: r.bullets,
  updatedAt: r.updated_at,
});

export type EntryInput = Omit<Entry, "id" | "userId" | "updatedAt">;

export const entryToRow = (e: EntryInput) => ({
  type: e.type,
  title: e.title,
  subtitle: e.subtitle || null,
  location: e.location || null,
  start_date: e.startDate || null,
  end_date: e.endDate || null,
  bullets: e.bullets,
  updated_at: new Date().toISOString(),
});

export const templateFromRow = (r: TemplateRow): Template => ({
  userId: r.user_id,
  header: r.header,
  sectionOrder: r.section_order,
  style: r.style,
  pageSize: r.page_size,
});
