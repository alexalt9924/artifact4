// Pure helpers for editing a resume's ordered entry ids. Resumes store ids, never entry copies.

import type { EntryType, Resume } from "@/types/resume";

export const ENTRY_TYPES: EntryType[] = ["education", "experience", "project", "skills"];

export const SECTION_TITLES: Record<EntryType, string> = {
  education: "Education",
  experience: "Experience",
  project: "Projects",
  skills: "Skills",
};

export type Sections = Resume["sections"];

export function emptySections(): Sections {
  return { education: [], experience: [], project: [], skills: [] };
}

/** Fills in any section missing from older saved data. */
export function normalizeSections(sections: Partial<Sections> | undefined): Sections {
  return { ...emptySections(), ...sections };
}

export function containsEntry(sections: Sections, entryId: string): boolean {
  return ENTRY_TYPES.some((type) => sections[type].includes(entryId));
}

/** Inserts an entry id into its section at `index` (end of section if omitted). No-op if already present. */
export function addEntry(sections: Sections, type: EntryType, entryId: string, index?: number): Sections {
  if (containsEntry(sections, entryId)) return sections;
  const ids = [...sections[type]];
  const at = index === undefined ? ids.length : Math.max(0, Math.min(index, ids.length));
  ids.splice(at, 0, entryId);
  return { ...sections, [type]: ids };
}

export function removeEntry(sections: Sections, entryId: string): Sections {
  const next = { ...sections };
  for (const type of ENTRY_TYPES) {
    if (next[type].includes(entryId)) next[type] = next[type].filter((id) => id !== entryId);
  }
  return next;
}

export function moveEntry(sections: Sections, type: EntryType, from: number, to: number): Sections {
  if (from === to) return sections;
  const ids = [...sections[type]];
  const [moved] = ids.splice(from, 1);
  ids.splice(to, 0, moved);
  return { ...sections, [type]: ids };
}

/** Section order from the template, plus any non-empty section the template left out so nothing is hidden. */
export function orderedSectionTypes(sectionOrder: EntryType[], sections: Sections): EntryType[] {
  const extras = ENTRY_TYPES.filter((type) => !sectionOrder.includes(type) && sections[type].length > 0);
  return [...sectionOrder, ...extras];
}
